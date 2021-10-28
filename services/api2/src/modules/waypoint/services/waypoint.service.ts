import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { IGeoJSON, IPolygonGeometry } from '../../common/types/geojson.type';
import { AppQuery } from '../../common/utilities/app-query';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ERouteOrigins } from '../../route/types/route-origin.type';
import {
  ICreateWaypointDTO,
  IFindWaypointByGeometryOptions,
  IGetRouteWaypointOptions,
  IWaypoint,
  IWaypointFindOneOptions,
} from '../types/waypoint.type';
import { WaypointTypeService } from './waypoint-type.service';

@Injectable()
export class WaypointService {
  constructor(
    @InjectKnexClient('Waypoint')
    private db: KnexClient<'Waypoint'>,
    private waypointTypeService: WaypointTypeService,
  ) {}

  async fromGeoJson(
    tx: TransactionManager,
    originId: ERouteOrigins,
    userId: string | null,
    geojson: IGeoJSON,
  ): Promise<{ boundingBox?: IPolygonGeometry; waypoints: IWaypoint[] }> {
    const newPoints = geojson.features
      .filter((feature) => feature.geometry.type === 'Point')
      .map((point) => {
        return {
          name: point.properties.name,
          description: point.properties.desc,
          typeIds: [],
          radiusInMeters: 100,
          originId,
          userId,
          coordinate: this.db.knex.raw('st_geomfromgeojson(?)', [JSON.stringify(point.geometry)]),
        };
      });

    if (newPoints.length === 0) {
      return { waypoints: [] };
    }

    const waypoints = await this.db.write(tx).insert(newPoints).cReturning();
    const boundingBox = (
      await this.db.builder
        .transacting(tx.ktx)
        .select({
          extent: this.db.knex.raw('st_asgeojson(st_extent(coordinate::geometry)::geometry)::json'),
        })
        .whereIn(
          'id',
          waypoints.map((w) => w.id),
        )
        .first()
    )?.extent as IPolygonGeometry;

    return { boundingBox, waypoints };
  }

  validateWaypointType(types: string[]): string[] {
    const record = this.waypointTypeService.findByIds(types);

    if (!types.every((t) => !!record[t])) {
      throw new NotFoundError(ErrorCodes.WAYPOINT_TYPE_NOT_FOUND, 'Waypoint type not found');
    }

    return types;
  }

  async createWaypoint(
    tx: TransactionManager,
    originId: ERouteOrigins,
    userId: string | null,
    payload: ICreateWaypointDTO,
  ): Promise<IWaypoint> {
    const [waypoint] = await this.db
      .write(tx)
      .insert({
        name: payload.name,
        description: payload.description,
        typeIds: this.validateWaypointType(payload.types),
        radiusInMeters: payload.radiusInMeters,
        originId,
        userId,
        coordinate: this.db.knex.raw(
          `st_geomfromtext('pointz(${payload.longitude} ${payload.latitude} ${payload.altitude})')`,
        ),
      })
      .cReturning();

    return waypoint;
  }

  async updateWaypoint(
    tx: TransactionManager,
    id: string,
    originId: ERouteOrigins,
    userId: string | null,
    payload: Partial<ICreateWaypointDTO>,
  ): Promise<IWaypoint> {
    let waypoint = await this.findOne(tx, id);
    const [longitude, latitude, altitude] = waypoint.coordinate.coordinates;
    const builder = this.db
      .write(tx)
      .update({
        name: payload.name,
        description: payload.description,
        typeIds: payload.types ? this.validateWaypointType(payload.types) : undefined,
        radiusInMeters: payload.radiusInMeters,
        originId,
        coordinate: this.db.knex.raw(
          `st_geomfromtext('pointz(${payload.longitude ?? longitude} ${
            payload.latitude ?? latitude
          } ${payload.altitude ?? altitude})')`,
        ) as any,
      })
      .where({ id })
      .cReturning();

    if (userId) builder.where({ userId });

    [waypoint] = await builder;

    if (!waypoint) {
      throw new NotFoundError(ErrorCodes.WAYPOINT_NOT_FOUND, 'Waypoint not found');
    }

    return waypoint;
  }

  async delete(
    tx: TransactionManager,
    id: string,
    options?: IWaypointFindOneOptions,
  ): Promise<IWaypoint> {
    const builder = this.db.write(tx).where({ id }).del().cReturning();

    AppQuery.withOptions(options ?? {})
      .withField('originId', (originId) => builder.where({ originId }))
      .withField('userId', (userId) => builder.where({ userId }));

    const [waypoint] = await builder;

    if (!waypoint) {
      throw new NotFoundError(ErrorCodes.WAYPOINT_NOT_FOUND, 'Waypoint not found');
    }

    return waypoint;
  }

  async findOne(
    tx: TransactionManager | null,
    id: string,
    options?: IWaypointFindOneOptions,
  ): Promise<IWaypoint> {
    const builder = this.db.read(tx).where({ id }).first();

    AppQuery.withOptions(options ?? {})
      .withField('originId', (originId) => builder.where({ originId }))
      .withField('userId', (userId) => builder.where({ userId }));

    const waypoint = await builder;

    if (!waypoint) {
      throw new NotFoundError(ErrorCodes.WAYPOINT_NOT_FOUND, 'Waypoint not found');
    }

    return waypoint;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<IWaypoint[]> {
    const waypoints = await this.db.read(tx).whereIn('id', ids);

    return waypoints;
  }

  async getRouteWaypoints(
    tx: TransactionManager | null,
    ids: string[],
    options: IGetRouteWaypointOptions = { searchWaypointsBy: 'track' },
  ) {
    const opts = new AppQuery(options);
    const builder = this.db.read(tx).select({ routeId: 'Route.id' });

    opts
      .withFieldValue('searchWaypointsBy', 'track', () => {
        builder.join('Route', (b) =>
          b
            .on(
              this.db.knex.raw('st_dwithin(??, ??, ?)', [
                'Waypoint.coordinate',
                'Route.coordinate',
                200,
              ]),
            )
            .andOnIn('Route.id', ids),
        );
      })
      .withFieldValue('searchWaypointsBy', 'boundingBox', () => {
        builder.join('Route', (b) =>
          b
            .on(
              this.db.knex.raw('st_dwithin(??, ??, ?)', [
                'Waypoint.coordinate',
                'Route.boundingBox',
                200,
              ]),
            )
            .andOnIn('Route.id', ids),
        );
      });

    const waypoints = (await builder) as unknown as (IWaypoint & { routeId: string })[];

    return waypoints;
  }

  async findByBoundingBox(
    tx: TransactionManager | null,
    geometry: IPolygonGeometry,
    options?: IFindWaypointByGeometryOptions,
  ): Promise<IWaypoint[]> {
    const opts = new AppQuery(options ?? {});
    const builder = this.db
      .read(tx)
      .where(
        this.db.knex.raw('st_covers(st_geomfromgeojson(?)::geography,??)', [
          JSON.stringify(geometry),
          'Waypoint.coordinate',
        ]),
      );

    opts
      .withField('originId', (originId) => builder.where({ originId }))
      .withField('userId', (userId) => builder.where({ userId }));

    const waypoints = await builder;

    return waypoints;
  }
}

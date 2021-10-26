import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { IGeoJSON, ILineStringGeometry } from '../../common/types/geojson.type';
import { AppQuery } from '../../common/utilities/app-query';
import { generateGroupRecord2 } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ExpeditionRouteService } from '../../expedition/services/expedition-route.service';
import { WaypointService } from '../../waypoint/services/waypoint.service';
import { IGetRouteWaypointOptions } from '../../waypoint/types/waypoint.type';
import { ERouteOrigins } from '../types/route-origin.type';
import {
  ICreateRouteDTO,
  ICreateRouteResult,
  IGetUserRoutesUrlParameters,
  IRoute,
  IRouteSlim,
} from '../types/route.type';

@Injectable()
export class RouteService {
  constructor(
    @InjectKnexClient('Route')
    private db: KnexClient<'Route'>,
    private waypointService: WaypointService,
    @Inject(forwardRef(() => ExpeditionRouteService))
    private expeditionRouteService: ExpeditionRouteService,
  ) {}

  geoJsonToLineString(geojson: IGeoJSON) {
    const coordinates = geojson.features
      .filter((feature) => feature.geometry.type === 'LineString')
      .map((feat) =>
        (feat.geometry as ILineStringGeometry).coordinates.map(
          ([longitude, latitude, altitude]) => {
            return {
              latitude,
              longitude,
              altitude,
            };
          },
        ),
      )
      .flat()
      .filter((location) => location.altitude !== null && location.longitude !== null);

    return `ST_GeogFromText('LINESTRINGZ(${coordinates
      .map((c) => `${c.longitude} ${c.latitude} ${c.altitude ?? 0}`)
      .join(',')})')`;
  }

  async fromGeoJson(
    tx: TransactionManager,
    originId: ERouteOrigins,
    payload: ICreateRouteDTO,
    geojson: IGeoJSON,
    userId?: string,
  ): Promise<ICreateRouteResult> {
    const geomString = this.geoJsonToLineString(geojson);
    const [route] = await this.db
      .write(tx)
      .insert({
        name: payload.name,
        description: payload.description,
        userId,
        originId,
        coordinate: this.db.knex.raw(geomString),
        boundingBox: this.db.knex.raw(`ST_Envelope(${geomString}::geometry)`),
      })
      .where('createdAt')
      .cReturning();

    const { waypoints } = await this.waypointService.fromGeoJson(
      tx,
      originId,
      userId ?? null,
      geojson,
    );

    return { route, waypoints };
  }

  async updateRoute(
    tx: TransactionManager,
    id: string,
    originId: ERouteOrigins,
    payload: Partial<ICreateRouteDTO>,
    userId?: string | null,
    geojson?: IGeoJSON | null,
  ): Promise<IRoute> {
    const geomString = geojson ? this.geoJsonToLineString(geojson) : null;
    const builder = this.db
      .write(tx)
      .update({
        name: payload.name,
        description: payload.description,
        ...(geomString && {
          coordinate: this.db.knex.raw(geomString),
          boundingBox: this.db.knex.raw(`ST_Envelope(${geomString}::geometry)`),
        }),
      })
      .where({ id, originId, userId })
      .cReturning();

    if (userId) builder.where({ userId });

    const [route] = await builder;

    if (!route) {
      throw new NotFoundError(ErrorCodes.ROUTE_NOT_FOUND, 'Route not found');
    }

    if (geojson) {
      await this.waypointService.fromGeoJson(tx, route.originId, route.userId, geojson);
    }

    return route;
  }

  async deleteRoute(
    tx: TransactionManager,
    id: string,
    originId: ERouteOrigins,
    userId: string | null = null,
  ): Promise<IRoute> {
    await this.expeditionRouteService.deleteRouteFromExpeditions(tx, id);

    const [route] = await this.db.write(tx).where({ id, originId, userId }).del().cReturning();

    if (!route) {
      throw new NotFoundError(ErrorCodes.ROUTE_NOT_FOUND, 'Route not found');
    }

    return route;
  }

  async findOne(tx: TransactionManager | null, id: string): Promise<IRoute> {
    const route = await this.db
      .read(tx, { overrides: { coordinate: { select: true } } })
      .where({ id })
      .first();

    if (!route) {
      throw new NotFoundError(ErrorCodes.ROUTE_NOT_FOUND, 'Route not found');
    }

    return route;
  }

  async findByIdsSlim(tx: TransactionManager | null, ids: string[]): Promise<IRouteSlim[]> {
    const routes = await this.db.read(tx).whereIn('id', ids);

    return routes;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<IRoute[]> {
    const routes = await this.db
      .read(tx, { overrides: { coordinate: { select: true } } })
      .whereIn('id', ids);

    return routes;
  }

  async getUserRoutes(
    tx: TransactionManager | null,
    userId: string,
    options: IGetUserRoutesUrlParameters,
  ): Promise<IRouteSlim[]> {
    const opts = new AppQuery(options);
    const builder = this.db.read(tx);

    opts.withField(
      'owner',
      (owners) => {
        if (owners.includes('me')) {
          builder.where({ userId });
        }
      },
      () => {
        builder.where({ userId }).orWhere({ userId: null });
      },
    );

    const routes = await builder;

    return routes;
  }

  async getAdminRoutes(): Promise<IRouteSlim[]> {
    const builder = this.db.read().orderBy('createdAt', 'desc');

    const routes = await builder;

    return routes;
  }

  async findByIdsWithWaypoints(
    tx: TransactionManager | null,
    ids: string[],
    options?: IGetRouteWaypointOptions,
  ) {
    const routes = await this.findByIds(tx, ids);
    const waypointsRecord = await this.waypointService
      .getRouteWaypoints(tx, ids, options)
      .then(generateGroupRecord2((w) => w.routeId));

    return routes.map((r) => ({ ...r, waypoints: waypointsRecord[r.id] ?? [] }));
  }

  async findOneWithWaypoints(
    tx: TransactionManager | null,
    id: string,
    options?: IGetRouteWaypointOptions,
  ) {
    const route = await this.findOne(tx, id);
    const waypoints = await this.waypointService.getRouteWaypoints(tx, [id], options);

    return { ...route, waypoints };
  }
}

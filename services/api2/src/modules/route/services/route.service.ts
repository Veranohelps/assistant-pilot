import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { uniq } from 'lodash';
import { SRecord } from '../../../types/helpers.type';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError, NotFoundError } from '../../common/errors/http.error';
import { IGeoJSON, ILineStringGeometry } from '../../common/types/geojson.type';
import AddFields from '../../common/utilities/add-fields';
import { AppQuery } from '../../common/utilities/app-query';
import { generateRecord2, recordToArray } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ExpeditionRouteService } from '../../expedition/services/expedition-route.service';
import { SkillLevelService } from '../../skill/services/skill-level.service';
import { WaypointService } from '../../waypoint/services/waypoint.service';
import { IGetRouteWaypointOptions } from '../../waypoint/types/waypoint.type';
import { ERouteOrigins } from '../types/route-origin.type';
import {
  ICreateRouteDTO,
  IGetUserRoutesUrlParameters,
  IRoute,
  IRouteSlim,
} from '../types/route.type';
import { analyseRoute } from '../utilities/analyse-route';
import { ActivityTypeService } from './activity-type.service';
import { RouteActivityTypeService } from './route-activity-type.service';

@Injectable()
export class RouteService {
  constructor(
    @InjectKnexClient('Route')
    private db: KnexClient<'Route'>,
    private waypointService: WaypointService,
    @Inject(forwardRef(() => ExpeditionRouteService))
    private expeditionRouteService: ExpeditionRouteService,
    private activityTypeService: ActivityTypeService,
    private skillLevelService: SkillLevelService,
    private routeActivityTypeService: RouteActivityTypeService,
  ) {}

  private _4326Spheroid = 'SPHEROID["WGS 84",6378137,298.257223563]';

  geoJsonToLineStringGeometry(geojson: IGeoJSON): ILineStringGeometry {
    const coordinates = geojson.features
      .filter((feature) => feature.geometry.type === 'LineString')
      .map((feat) =>
        (feat.geometry as ILineStringGeometry).coordinates.map(
          ([longitude, latitude, altitude]) => {
            return [longitude, latitude, altitude];
          },
        ),
      )
      .flat()
      .filter((point) => point[2] !== null && point[1] !== null);

    return { type: 'LineString', coordinates: coordinates as ILineStringGeometry['coordinates'] };
  }

  lineStringGeomToString(geom: ILineStringGeometry): string {
    return `ST_GeogFromText('LINESTRINGZ(${geom.coordinates
      .map((c) => `${c[0]} ${c[1]} ${c[2] ?? 0}`)
      .join(',')})')`;
  }

  async validateLevelsAndActivities(
    tx: TransactionManager | null,
    levelIds: string[],
    activityTypeIds: string[],
  ): Promise<void> {
    const activityTypes = Object.values(this.activityTypeService.findByIds(activityTypeIds));
    const skillIds = Object.values(await this.skillLevelService.findByIds(tx, levelIds)).map(
      (level) => level.skillId,
    );

    if (skillIds.length !== uniq(skillIds).length) {
      throw new BadRequestError(
        ErrorCodes.INVALID_ROUTE_LEVEL_IDS,
        'A route can only specify 1 level per skill',
      );
    }

    // for every activity type associated with a skill, check that the skill is provided
    const isLevelsValid = activityTypes.every((type) =>
      type.skillId ? skillIds.includes(type.skillId) : true,
    );

    if (!isLevelsValid) {
      throw new BadRequestError(
        ErrorCodes.INVALID_ROUTE_LEVEL_IDS,
        'Some activity types you chose require certain skills that are not provided',
      );
    }

    // for every level, check that activities associated with the level's skill is provided
    const skillActivityTypes = Object.values(
      this.activityTypeService.getSkillsActivities(skillIds),
    );
    const isActivitiesValid = skillActivityTypes.every(
      (types) => !types.length || types.some((t) => activityTypeIds.includes(t.id)),
    );

    if (!isActivitiesValid) {
      throw new BadRequestError(
        ErrorCodes.INVALID_ROUTE_ACTIVITY_TYPE_IDS,
        'Some levels you chose for this route require that you provide certain activity types',
      );
    }

    return;
  }

  async fromGeoJson(
    tx: TransactionManager,
    originId: ERouteOrigins,
    payload: ICreateRouteDTO,
    geojson: IGeoJSON,
    userId?: string,
  ): Promise<IRoute> {
    const lineStringGeom = this.geoJsonToLineStringGeometry(geojson);
    const geomString = this.lineStringGeomToString(lineStringGeom);
    const routeParams = analyseRoute(lineStringGeom);

    const [existingRoute, existingRouteByUser] = await Promise.all([
      this.db
        .read(tx, { overrides: { globalId: { select: true } } })
        .where('coordinate', this.db.knex.raw(geomString))
        .first(),
      this.db
        .read(tx)
        .where('coordinate', this.db.knex.raw(geomString))
        .where('userId', userId ?? null)
        .first(),
    ]);

    if (existingRouteByUser) {
      throw new BadRequestError(
        ErrorCodes.DUPLICATE_ROUTE,
        `You have an existing route "${existingRouteByUser.name}" with the same track as the route you are attempting to upload, if this is intentional, consider cloning it`,
      );
    }

    await this.validateLevelsAndActivities(tx, payload.levels ?? [], payload.activityTypes);

    const [route] = await this.db
      .write(tx)
      .insert({
        globalId: existingRoute?.globalId,
        name: payload.name,
        description: payload.description,
        levelIds: payload.levels,
        activityTypeIds: payload.activityTypes,
        userId,
        originId,
        coordinate: this.db.knex.raw(geomString),
        boundingBox: this.db.knex.raw(`ST_Envelope(${geomString}::geometry)`),
        distanceInMeters: this.db.knex.raw(
          `st_lengthspheroid(${geomString}::geometry, '${this._4326Spheroid}')`,
        ),
        elevationGainInMeters: routeParams.elevationGainInMeters,
        elevationLossInMeters: routeParams.elevationLossInMeters,
        highestPointInMeters: routeParams.highestPointInMeters,
        lowestPointInMeters: routeParams.lowestPointInMeters,
        meteoPointsOfInterests: this.db.knex.raw(`ST_GeomFromGeoJSON(?)`, [
          JSON.stringify(routeParams.meteoPointsOfInterests),
        ]),
      })
      .where('createdAt')
      .cReturning();

    await this.routeActivityTypeService.addActivities(tx, route);

    return route;
  }

  async cloneRoute(
    tx: TransactionManager,
    routeId: string,
    payload: ICreateRouteDTO,
    userId?: string,
  ): Promise<IRoute> {
    const sourceRoute = await this.findOne(tx, routeId);

    const geomString = this.lineStringGeomToString(sourceRoute.coordinate as ILineStringGeometry);

    await this.validateLevelsAndActivities(tx, payload.levels ?? [], payload.activityTypes);

    const [route] = await this.db
      .write(tx)
      .insert({
        globalId: sourceRoute.globalId,
        name: payload.name,
        description: payload.description,
        levelIds: payload.levels,
        activityTypeIds: payload.activityTypes,
        userId,
        originId: sourceRoute.originId,
        coordinate: this.db.knex.raw(geomString),
        boundingBox: this.db.knex.raw(`ST_Envelope(${geomString}::geometry)`),
        distanceInMeters: sourceRoute.distanceInMeters,
        elevationGainInMeters: sourceRoute.elevationGainInMeters,
        elevationLossInMeters: sourceRoute.elevationLossInMeters,
        highestPointInMeters: sourceRoute.highestPointInMeters,
        lowestPointInMeters: sourceRoute.lowestPointInMeters,
        meteoPointsOfInterests: this.db.knex.raw(`ST_GeomFromGeoJSON(?)`, [
          JSON.stringify(sourceRoute.meteoPointsOfInterests),
        ]),
      })
      .where('createdAt')
      .cReturning();

    await this.routeActivityTypeService.addActivities(tx, route);

    return route;
  }

  async updateRoute(
    tx: TransactionManager,
    id: string,
    originId: ERouteOrigins,
    payload: Partial<ICreateRouteDTO>,
    userId?: string | null,
    geojson?: IGeoJSON | null,
  ): Promise<IRoute> {
    const lineStringGeom = geojson ? this.geoJsonToLineStringGeometry(geojson) : null;
    const geomString = lineStringGeom ? this.lineStringGeomToString(lineStringGeom) : null;
    const routeParams = lineStringGeom ? analyseRoute(lineStringGeom) : null;

    const [existingRoute, existingRouteByUser] = geomString
      ? await Promise.all([
          this.db
            .read(tx, { overrides: { globalId: { select: true } } })
            .where('coordinate', this.db.knex.raw(geomString))
            .first(),
          this.db
            .read(tx)
            .where('coordinate', this.db.knex.raw(geomString))
            .where('userId', userId ?? null)
            .first(),
        ])
      : [null, null];

    if (existingRouteByUser) {
      throw new BadRequestError(
        ErrorCodes.DUPLICATE_ROUTE,
        `You have an existing route "${existingRouteByUser.name}" with the same track as the route you are attempting to edit, if this is intentional, consider cloning it`,
      );
    }

    const builder = this.db
      .write(tx)
      .update({
        globalId: existingRoute?.globalId ?? undefined,
        name: payload.name,
        description: payload.description,
        activityTypeIds: payload.activityTypes ?? undefined,
        levelIds: payload.levels ?? undefined,
        ...(geomString &&
          routeParams && {
            coordinate: this.db.knex.raw(geomString),
            boundingBox: this.db.knex.raw(`ST_Envelope(${geomString}::geometry)`),
            distanceInMeters: this.db.knex.raw(
              `st_lengthspheroid(${geomString}::geometry, '${this._4326Spheroid}')`,
            ),
            elevationGainInMeters: routeParams.elevationGainInMeters,
            elevationLossInMeters: routeParams.elevationLossInMeters,
            highestPointInMeters: routeParams.highestPointInMeters,
            lowestPointInMeters: routeParams.lowestPointInMeters,
            meteoPointsOfInterests: this.db.knex.raw(`ST_GeomFromGeoJSON(?)`, [
              JSON.stringify(routeParams.meteoPointsOfInterests),
            ]),
          }),
      })
      .where({ id, originId, userId })
      .cReturning();

    if (userId) builder.where({ userId });

    const [route] = await builder;

    if (!route) {
      throw new NotFoundError(ErrorCodes.ROUTE_NOT_FOUND, 'Route not found');
    }

    await this.validateLevelsAndActivities(tx, route.levelIds ?? [], route.activityTypeIds);
    await this.routeActivityTypeService.updateActivities(tx, route);

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
      .read(tx, { overrides: { coordinate: { select: true }, globalId: { select: true } } })
      .where({ id })
      .first();

    if (!route) {
      throw new NotFoundError(ErrorCodes.ROUTE_NOT_FOUND, 'Route not found');
    }

    return route;
  }

  async findByIdsSlim(tx: TransactionManager | null, ids: string[]): Promise<SRecord<IRouteSlim>> {
    const routes = await this.db
      .read(tx)
      .whereIn('id', ids)
      .then(generateRecord2((r) => r.id));

    return routes;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<SRecord<IRoute>> {
    const routes = await this.db
      .read(tx, { overrides: { coordinate: { select: true } } })
      .whereIn('id', ids)
      .then(generateRecord2((r) => r.id));

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
    const routes = await this.findByIds(tx, ids)
      .then((res) => Object.values(res))
      .then((res) =>
        AddFields.target(res).add(
          'waypoints',
          () => this.waypointService.getRouteWaypoints(tx, ids, options),
          (route, record) => record[route.id] ?? [],
        ),
      )
      .then(generateRecord2((r) => r.id));

    return routes;
  }

  async findOneWithWaypoints(
    tx: TransactionManager | null,
    id: string,
    options?: IGetRouteWaypointOptions,
  ) {
    const route = await this.findOne(tx, id).then((r) =>
      AddFields.target(r)
        .add('waypoints', () =>
          this.waypointService.getRouteWaypoints(tx, [r.id], options).then((w) => w[r.id] ?? []),
        )
        .add('activityTypes', () =>
          recordToArray(this.activityTypeService.findByIds(r.activityTypeIds)),
        )
        .add('activities', () =>
          this.routeActivityTypeService
            .getRouteActivities(null, r.id)
            .then(generateRecord2((a) => a.activityTypeId)),
        )
        .add('levels', () => this.skillLevelService.findByIds(tx, r.levelIds).then(recordToArray)),
    );

    return route;
  }
}

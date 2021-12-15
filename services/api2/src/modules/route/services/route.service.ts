import { Injectable } from '@nestjs/common';
import _, { uniq } from 'lodash';
import { SRecord } from '../../../types/helpers.type';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError, NotFoundError, ServerError } from '../../common/errors/http.error';
import { ElevationService, ElevationStatus } from '../../common/services/elevation.service';
import { EventService } from '../../common/services/event.service';
import { GeocodingService } from '../../common/services/geocoding.service';
import { TimezoneService } from '../../common/services/timezone.service';
import { IGeoJSON, ILineStringGeometry } from '../../common/types/geojson.type';
import AddFields from '../../common/utilities/add-fields';
import { AppQuery } from '../../common/utilities/app-query';
import { createKnexStream } from '../../common/utilities/create-knex-stream';
import {
  generateGroupRecord,
  generateRecord,
  generateRecord2,
  recordToArray,
} from '../../common/utilities/generate-record';
import {
  lineStringGeometryPlaceholder,
  polygonGeometryPlaceholder,
} from '../../common/utilities/gpx-to-geojson';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { SkillLevelService } from '../../skill/services/skill-level.service';
import { WaypointService } from '../../waypoint/services/waypoint.service';
import { IGetRouteWaypointOptions } from '../../waypoint/types/waypoint.type';
import { WeatherService } from '../../weather/services/weather.service';
import { ERouteEvents } from '../events/event-types/route.event-type';
import { ERouteOrigins } from '../types/route-origin.type';
import {
  ICreateRouteDTO,
  IGetUserRoutesUrlParameters,
  IRoute,
  IRouteSlim,
  IRouteWeather,
  ISearchRoutesResult,
  TMPIRoutePartial,
} from '../types/route.type';
import { analyseRoute, IRouteAnalysis, IRoutePartial } from '../utils/analyse-route';
import { ActivityTypeService } from './activity-type.service';
import { RouteActivityTypeService } from './route-activity-type.service';

@Injectable()
export class RouteService {
  constructor(
    @InjectKnexClient('Route')
    private db: KnexClient<'Route'>,
    private waypointService: WaypointService,
    private activityTypeService: ActivityTypeService,
    private skillLevelService: SkillLevelService,
    private routeActivityTypeService: RouteActivityTypeService,
    private elevationService: ElevationService,
    private timezoneService: TimezoneService,
    private eventService: EventService,
    private weatherService: WeatherService,
    private geocodingService: GeocodingService,
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

  async getDistanceFromPointsOfInterest2(
    partialsRecord: SRecord<IRouteAnalysis['routePartials']>,
  ): Promise<SRecord<TMPIRoutePartial[]>> {
    const table: { id: string; altitude: number; coordinate: ILineStringGeometry }[] = [];

    _.forEach(partialsRecord, (partials, id) => {
      partials.forEach((p, key) => {
        table.push({
          id,
          altitude: key,
          coordinate: p.coordinate,
        });
      });
    });

    if (!table.length) return {};

    const builder = this.db.knex
      .queryBuilder()
      .select('id', 'altitude')
      .select({
        distanceInMeters: this.db.knex.raw(
          `st_lengthspheroid(ST_GeomFromGeoJSON(coordinate), '${this._4326Spheroid}')`,
        ),
      })
      .from(
        this.db.knex.raw('json_to_recordset(?) as (id varchar, altitude int, coordinate json)', [
          JSON.stringify(table),
        ]),
      );

    const distances: { id: string; altitude: number; distanceInMeters: number }[] = await builder;

    const distanceRecord = generateGroupRecord(distances, (d) => d.id);

    const result = _.mapValues(distanceRecord, (record, id) => {
      return record.map((d) => {
        const {
          coordinate: { coordinates },
          highestPointInMeters,
          lowestPointInMeters,
          elevationGainInMeters,
          elevationLossInMeters,
        } = partialsRecord[id].get(Number(d.altitude)) as IRoutePartial;

        return {
          coordinate: coordinates[coordinates.length - 1],
          distanceInMeters: d.distanceInMeters,
          highestPointInMeters,
          lowestPointInMeters,
          elevationGainInMeters,
          elevationLossInMeters,
        };
      });
    });

    return result;
  }

  async fromGeoJson(
    tx: TransactionManager,
    originId: ERouteOrigins,
    payload: ICreateRouteDTO,
    geojson: IGeoJSON,
    userId?: string,
  ): Promise<IRoute> {
    const lineStringGeom = this.geoJsonToLineStringGeometry(geojson);
    const startingPointAltitude = lineStringGeom.coordinates[0][2];

    if (startingPointAltitude == null) {
      const startingPointLongitude = lineStringGeom.coordinates[0][0];
      const startingPointLatitude = lineStringGeom.coordinates[0][1];
      try {
        const elevationResponse = await this.elevationService.getElevation({
          type: 'Point',
          coordinates: [startingPointLongitude, startingPointLatitude, startingPointAltitude],
        });
        if (elevationResponse.status == ElevationStatus.OK) {
          lineStringGeom.coordinates[0][2] = elevationResponse.results[0].elevation;
        } else {
          console.error(
            `No altitude available for route's starting point ${elevationResponse.error_message}`,
          );
          throw new ServerError(
            ErrorCodes.SERVER_ERROR,
            `No altitude available for route's starting point ${elevationResponse.error_message}`,
          );
        }
      } catch (err) {
        console.error("No altitude available for route's starting point");
        throw new ServerError(
          ErrorCodes.SERVER_ERROR,
          "No altitude available for route's starting point",
        );
      }
    }

    const geomString = this.lineStringGeomToString(lineStringGeom);
    const routeParams = analyseRoute(lineStringGeom);
    const meteoPointsOfInterestsRoutePartials = await this.getDistanceFromPointsOfInterest2({
      partials: routeParams.routePartials,
    }).then((res) => res.partials);
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

    await this.validateLevelsAndActivities(tx, payload.levels ?? [], payload.activityTypes ?? []);
    let activityTypes = payload.activityTypes;
    if (!activityTypes) {
      activityTypes = this.activityTypeService.all().map((at) => at.id);
    }
    const [route] = await this.db
      .write(tx)
      .insert({
        globalId: existingRoute?.globalId,
        name: payload.name,
        description: payload.description,
        levelIds: payload.levels,
        activityTypeIds: activityTypes,
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
        meteoPointsOfInterestsRoutePartials,
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
        meteoPointsOfInterestsRoutePartials: sourceRoute.meteoPointsOfInterestsRoutePartials,
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
            meteoPointsOfInterestsRoutePartials: await this.getDistanceFromPointsOfInterest2({
              [id]: routeParams.routePartials,
            }).then((res) => res[id]),
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

  async updateUserRoute(
    tx: TransactionManager,
    id: string,
    payload: Partial<ICreateRouteDTO>,
    userId?: string,
  ) {
    const userRoute = await this.db
      .read(tx, { overrides: { coordinate: { select: true }, globalId: { select: true } } })
      .where({ id })
      .where({ userId })
      .first();

    if (!userRoute) {
      throw new NotFoundError(
        ErrorCodes.ROUTE_NOT_FOUND,
        'Route not found or not belong to the user',
      );
    }
    const [update] = await this.db
      .write(tx)
      .where({ id })
      .update({ name: payload.name, description: payload.description })
      .cReturning();
    return update;
  }

  async deleteRoute(
    tx: TransactionManager,
    id: string,
    originId: ERouteOrigins,
    userId: string | null = null,
  ): Promise<IRoute> {
    const route = await this.db.write(tx).where({ id, originId, userId }).first();

    if (!route) {
      throw new NotFoundError(ErrorCodes.ROUTE_NOT_FOUND, 'Route not found');
    }

    await this.eventService.emitAsync(ERouteEvents.DELETE_ROUTES, { tx, routes: [route], userId });

    await this.db.write(tx).where({ id: route.id }).del();

    return route;
  }

  async deleteUserRoutes(tx: TransactionManager, userId: string): Promise<IRoute[]> {
    const routes = await this.db.write(tx).where({ userId });

    if (!routes.length) {
      return [];
    }

    await this.eventService.emitAsync(ERouteEvents.DELETE_ROUTES, { tx, routes, userId });

    await this.db.write(tx).where({ userId }).del();

    return routes;
  }

  async updateExpeditionCount(
    tx: TransactionManager,
    routeIds: string[],
    delta: number,
  ): Promise<IRoute[]> {
    if (!routeIds.length) return [];

    const routes = await this.db
      .write(tx)
      .whereIn('id', routeIds)
      .increment('expeditionCount', delta)
      .returning('*');

    return routes;
  }

  async refreshRoute(tx: TransactionManager, routeId: string): Promise<IRoute> {
    const route = await this.findOne(tx, routeId);

    const routeParams = analyseRoute(route.coordinate as ILineStringGeometry);
    const meteoPointsOfInterestsRoutePartials = await this.getDistanceFromPointsOfInterest2({
      [routeId]: routeParams.routePartials,
    }).then((res) => res[routeId]);

    const [update] = await this.db
      .write(tx)
      .update({
        elevationGainInMeters: routeParams.elevationGainInMeters,
        elevationLossInMeters: routeParams.elevationLossInMeters,
        highestPointInMeters: routeParams.highestPointInMeters,
        lowestPointInMeters: routeParams.lowestPointInMeters,
        meteoPointsOfInterests: this.db.knex.raw(`ST_GeomFromGeoJSON(?)`, [
          JSON.stringify(routeParams.meteoPointsOfInterests),
        ]),
        meteoPointsOfInterestsRoutePartials,
      })
      .where({ id: routeId })
      .cReturning();

    await this.routeActivityTypeService.updateEstimations(tx, [update]);
    await this.eventService.emitAsync(ERouteEvents.UPDATE_ROUTES, { tx, routes: [update] });

    return update;
  }

  async refreshAllRoutes(tx: TransactionManager): Promise<void> {
    await createKnexStream(this.db.read(tx, { selectAll: true }), async (routes) => {
      const globalIds = routes.map((r) => r.globalId as string);
      const globalIdRecord = generateRecord(routes, (r) => r.globalId as string);

      const routeParamsRecord = await tx.cache.getMany('routeParams', globalIds, (keys) => {
        const record: SRecord<IRouteAnalysis> = {};

        keys.forEach((key) => {
          record[key] = analyseRoute(globalIdRecord[key].coordinate as ILineStringGeometry);
        });

        return Promise.resolve(record);
      });
      const MPIRoutePartialsRecord = await tx.cache.getMany('routeMPIParams', globalIds, (keys) =>
        this.getDistanceFromPointsOfInterest2(
          generateRecord(
            keys,
            (key) => key,
            (key) => routeParamsRecord[key].routePartials,
          ),
        ),
      );

      const updates = routes.map((route) => {
        const routeParams = routeParamsRecord[route.globalId as string];

        return {
          ...route,
          coordinate: lineStringGeometryPlaceholder,
          boundingBox: polygonGeometryPlaceholder,
          elevationGainInMeters: routeParams.elevationGainInMeters,
          elevationLossInMeters: routeParams.elevationLossInMeters,
          highestPointInMeters: routeParams.highestPointInMeters,
          lowestPointInMeters: routeParams.lowestPointInMeters,
          meteoPointsOfInterests: this.db.knex.raw(`ST_GeomFromGeoJSON(?)`, [
            JSON.stringify(routeParams.meteoPointsOfInterests),
          ]),
          meteoPointsOfInterestsRoutePartials:
            MPIRoutePartialsRecord[route.globalId as string] ?? [],
        };
      });

      const updatedRoutes = await this.db
        .write(tx)
        .insert(updates)
        .onConflict('id')
        .merge([
          'elevationGainInMeters',
          'elevationLossInMeters',
          'highestPointInMeters',
          'lowestPointInMeters',
          'meteoPointsOfInterests',
          'meteoPointsOfInterestsRoutePartials',
        ] as any[])
        .cReturning();

      await this.routeActivityTypeService.updateEstimations(tx, updatedRoutes);
      await this.eventService.emitAsync(ERouteEvents.UPDATE_ROUTES, { tx, routes: updatedRoutes });
    });
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
    const builder = this.db
      .read(tx, { overrides: { coordinate: { select: true } } })
      .whereIn('id', ids);

    const routes = await builder
      .then((res) =>
        AddFields.target(res).add('timezone', async () =>
          recordToArray(await this.timezoneService.getTimezones(res)),
        ),
      )
      .then(generateRecord2((r) => r.id));

    return routes;
  }

  async getRouteWeather(routeId: string): Promise<IRouteWeather> {
    const route = await this.findOne(null, routeId);
    const predictions = await this.weatherService.getForecast(route);

    return predictions;
  }

  async getUserRoutes(
    tx: TransactionManager | null,
    userId: string,
    options: IGetUserRoutesUrlParameters,
  ): Promise<IRouteSlim[]> {
    const opts = new AppQuery(options);
    const builder = this.db.read(tx).orderBy('createdAt', 'desc');

    opts
      .withField(
        'owner',
        (owners) => {
          if (owners.includes('me')) {
            builder.where({ userId });
          }
        },
        () => {
          builder.where({ userId }).orWhere({ userId: null });
        },
      )
      .withField('name', (name) => {
        builder.whereRaw(`regexp_replace(name, '\s+', '') ilike ?`, [
          `%${name.replace(/\s+/g, '')}%`,
        ]);
      })
      .withField('levels', (levels) => {
        builder.where('levelIds', '&&', levels);
      })
      .withField('activityTypes', (types) => {
        builder.where('activityTypeIds', '&&', types);
      });

    const routes = await builder;

    return routes;
  }

  async getAdminRoutes(): Promise<IRouteSlim[]> {
    const builder = this.db.read().where({ userId: null }).orderBy('createdAt', 'desc');

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
        AddFields.target(res)
          .add(
            'waypoints',
            () => this.waypointService.getRouteWaypoints(tx, ids, options),
            (route, record) => record[route.id] ?? [],
          )
          .add(
            'activityTypes',
            () => this.activityTypeService.findByIds(res.map((r) => r.activityTypeIds).flat()),
            (route, record) => route.activityTypeIds.map((id) => record[id]),
          )
          .add(
            'activities',
            () => this.routeActivityTypeService.getActivitiesByRouteIds(null, ids),
            (route, record) => generateRecord(record[route.id], (a) => a.activityTypeId),
          )
          .add(
            'levels',
            () => this.skillLevelService.findByIds(tx, res.map((r) => r.levelIds).flat()),
            (route, record) => route.levelIds.map((id) => record[id]),
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
    const route = await this.findOne(tx, id).then(async (r) =>
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
        .add('levels', () => this.skillLevelService.findByIds(tx, r.levelIds).then(recordToArray))
        .add('timezone', () =>
          this.timezoneService.getTimezone(r.coordinate as ILineStringGeometry),
        ),
    );

    return route;
  }

  async search(userId: string, options: IGetUserRoutesUrlParameters): Promise<ISearchRoutesResult> {
    const opts = new AppQuery(options);
    const builder = this.db.read().orderBy('createdAt', 'desc');

    opts
      .withField(
        'owner',
        (owners) => {
          if (owners.includes('me')) {
            builder.where({ userId });
          }
        },
        () => builder.where((b) => b.where({ userId }).orWhere({ userId: null })),
      )
      .withField('levels', (levels) => {
        builder.where('levelIds', '&&', levels);
      })
      .withField('activityTypes', (types) => {
        builder.where('activityTypeIds', '&&', types);
      });

    const name = opts.query.name;

    if (!name) {
      return {
        routes: [],
        locations: [],
      };
    }

    const geocodeLocations = await this.geocodingService.searchByName(name);

    const routesByNameBuilder = builder
      .clone()
      .whereRaw(`regexp_replace(lower(name), ' +', '') ilike ?`, [
        `%${opts.query.name?.replace(/\s+/g, '')}%`,
      ]);
    const routesByLocationBuilder = builder
      .clone()
      .select('placeId')
      .innerJoin(
        this.db.knex.raw(
          '(select * from json_to_recordset(?) as ("placeId" varchar, coordinate text)) as location on ST_Intersects(ST_GeomFromGeoJSON(??), ??)',
          [
            JSON.stringify(
              geocodeLocations.map((location) => ({
                placeId: location.place_id,
                coordinate: this.geocodingService.viewPortToPolygon(location.geometry.viewport),
              })),
            ),
            'location.coordinate',
            'Route.coordinate',
          ],
        ),
      );

    const [routesByName, routesByLocation] = await Promise.all([
      routesByNameBuilder,
      geocodeLocations.length
        ? (routesByLocationBuilder as Promise<(IRoute & { placeId: string })[]>)
        : [],
    ]);

    const routeByLocationRecord = generateGroupRecord(routesByLocation, (r) => r.placeId);
    const locations = geocodeLocations.map((location) => ({
      fullName: location.formatted_address,
      boundingBox: this.geocodingService.viewPortToPolygon(location.geometry.viewport),
      routes: routeByLocationRecord[location.place_id] ?? [],
    }));

    return {
      routes: routesByName,
      locations,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { gpx } from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { IGeoJSON } from '../../common/types/geojson.type';
import { generateGroupRecord2 } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { RouteService } from '../../route/services/route.service';
import { WaypointService } from '../../waypoint/services/waypoint.service';
import { ICreateExpeditionDTO, IExpedition, IExpeditionFull } from '../types/expedition.type';
import { ExpeditionRouteService } from './expedition-route.service';
import { ExpeditionWaypointService } from './expedition-waypoint.service';

@Injectable()
export class ExpeditionService {
  constructor(
    @InjectKnexClient('Expedition')
    private db: KnexClient<'Expedition'>,
    private waypointService: WaypointService,
    private routeService: RouteService,
    private expeditionRouteService: ExpeditionRouteService,
    private expeditionWaypointService: ExpeditionWaypointService,
    private configService: ConfigService,
  ) {}

  async createFromGeojson(
    tx: TransactionManager,
    data: ICreateExpeditionDTO,
    file: Express.Multer.File,
  ): Promise<IExpeditionFull> {
    const gpxDocument = new DOMParser().parseFromString(file.buffer.toString('utf-8'));
    const parsedDocument: IGeoJSON = gpx(gpxDocument);
    const waypoints = await this.waypointService.fromGeoJson(tx, parsedDocument);
    const route = await this.routeService.fromGeoJson(tx, parsedDocument);
    const [{ id }] = await this.db
      .write(tx)
      .insert({
        name: data.name,
        description: data.description,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        coordinate: this.db.knex.raw(
          `ST_GeogFromText('POINTZ(${data.longitude} ${data.latitude} ${data.altitude ?? 0})')`,
        ),
      })
      .returning('*');
    await this.expeditionRouteService.addRoutes(tx, id, [route.id]);
    await this.expeditionWaypointService.addWaypoints(
      tx,
      id,
      waypoints.map((w) => w.id),
    );

    const result: IExpeditionFull = await this.getExpeditionFull(tx, id, 'admin');

    return result;
  }

  async createFromGeojson2(
    tx: TransactionManager,
    data: ICreateExpeditionDTO,
    gpxString: string,
  ): Promise<IExpeditionFull> {
    const gpxDocument = new DOMParser().parseFromString(gpxString);
    const parsedDocument: IGeoJSON = gpx(gpxDocument);
    const waypoints = await this.waypointService.fromGeoJson(tx, parsedDocument);
    const route = await this.routeService.fromGeoJson(tx, parsedDocument);
    const [{ id }] = await this.db
      .write(tx)
      .insert({
        name: data.name,
        description: data.description,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        coordinate: this.db.knex.raw(
          `ST_GeogFromText('POINTZ(${data.longitude} ${data.latitude} ${data.altitude ?? 0})')`,
        ),
      })
      .returning('*');
    await this.expeditionRouteService.addRoutes(tx, id, [route.id]);
    await this.expeditionWaypointService.addWaypoints(
      tx,
      id,
      waypoints.map((w) => w.id),
    );

    const result: IExpeditionFull = await this.getExpeditionFull(tx, id, 'admin');

    return result;
  }

  async getExpeditionFull(
    tx: TransactionManager | null,
    id: string,
    namespace: string,
  ): Promise<IExpeditionFull> {
    const expedition = await this.db.read(tx).where({ id }).first();

    if (!expedition) {
      throw new NotFoundError(ErrorCodes.EXPEDITION_NOT_FOUND, 'Expedition not found');
    }

    const [expeditionWaypoints, expeditionRoutes] = await Promise.all([
      this.expeditionWaypointService.getWaypoints(tx, id),
      this.expeditionRouteService.getRoutes(tx, id, namespace),
    ]);

    const result = {
      ...expedition,
      routes: expeditionRoutes.map((e) => e.routes).flat(),
      waypoints: expeditionWaypoints.map((e) => e.waypoints).flat(),
    };

    return result;
  }

  async getExpeditionsFull(namespace: string): Promise<IExpeditionFull[]> {
    const expeditions = await this.db.read();
    const [expeditionWaypoints, expeditionRoutes] = await Promise.all([
      this.expeditionWaypointService
        .getWaypoints(
          null,
          expeditions.map((e) => e.id),
        )
        .then(generateGroupRecord2((e) => e.expeditionId)),
      this.expeditionRouteService
        .getRoutes(
          null,
          expeditions.map((e) => e.id),
          namespace,
        )
        .then(generateGroupRecord2((e) => e.expeditionId)),
      ,
    ]);

    const result = expeditions.map<IExpeditionFull>((expedition) => ({
      ...expedition,
      routes: expeditionRoutes[expedition.id].map((e) => e.routes).flat(),
      waypoints: (expeditionWaypoints[expedition.id] !== undefined) ? expeditionWaypoints[expedition.id].map((e) => e.waypoints).flat() : [],
    }));

    return result;
  }

  async getExpeditions(): Promise<IExpedition[]> {
    const expeditions = await this.db.read();

    return expeditions;
  }
}

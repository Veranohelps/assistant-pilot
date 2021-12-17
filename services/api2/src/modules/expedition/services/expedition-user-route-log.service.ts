import { Injectable } from '@nestjs/common';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import AddFields from '../../common/utilities/add-fields';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { RouteService } from '../../route/services/route.service';
import { ERouteOrigins } from '../../route/types/route-origin.type';
import { EExpeditionUserEventType, IExpeditionUserEventData } from '../types/expedition-event.type';
import {
  EExpeditionLogOrigin,
  ICreateExpeditionUserRouteLog,
  IExpeditionUserRouteLog,
} from '../types/expedition-log.type';
import { IExpeditionUser } from '../types/expedition-user.type';
import { ExpeditionUserEventService } from './expedition-event.service';
import { ExpeditionUserService } from './expedition-user.service';
import { ExpeditionService } from './expedition.service';

@Injectable()
export class ExpeditionUserRouteLogService {
  constructor(
    @InjectKnexClient('ExpeditionUserRouteLog')
    private expeditionLogDb: KnexClient<'ExpeditionUserRouteLog'>,
    private routeService: RouteService,
    private expeditionUserEventService: ExpeditionUserEventService,
    private expeditionService: ExpeditionService,
    private expeditionUserService: ExpeditionUserService,
  ) {}

  async insertExpeditionLog(
    tx: TransactionManager,
    entry: ICreateExpeditionUserRouteLog,
  ): Promise<IExpeditionUserRouteLog> {
    const [expeditionLog] = await this.expeditionLogDb.write(tx).insert(entry).cReturning();

    return expeditionLog;
  }
  async createExpeditionLog(
    tx: TransactionManager,
    userId: string,
    expeditionId: string,
    events: IExpeditionUserEventData[],
  ): Promise<IExpeditionUser> {
    //First of all, validate the userId have this expeditionId
    await this.expeditionUserService.getExpeditionUser(tx, expeditionId, userId);
    await this.expeditionUserEventService.insertArrayOfEvents(tx, expeditionId, userId, events);
    const types: string[] = [
      EExpeditionUserEventType.LOCATION,
      EExpeditionUserEventType.START,
      EExpeditionUserEventType.FINISH,
    ];
    const expeditionEvents = await this.expeditionUserEventService.getExpeditionUserEvents(
      tx,
      expeditionId,
      userId,
      types,
    );
    const coordinates: any[] = [];
    expeditionEvents.forEach((e) => {
      if (e.coordinate) {
        const [longitude, latitude, altitude] = e.coordinate.coordinates;
        if (altitude == 0) {
          coordinates.push([longitude, latitude]);
        } else {
          coordinates.push([longitude, latitude, altitude]);
        }
      }
    });
    const lineStringGeom: ILineStringGeometry = { type: 'LineString', coordinates: coordinates };
    const expedition = await this.expeditionService.findOne(tx, expeditionId);
    let meters = 0;
    let actualRoute;
    if (lineStringGeom.coordinates.length > 1) {
      const routeData = {
        name: `Rote from expedition: ${expedition.name}`,
        description: expedition.description,
        activityTypes: [],
        levels: [],
        coordinate: lineStringGeom,
      };
      actualRoute = await this.routeService.createRouteFromExpedition(
        tx,
        ERouteOrigins.EXPEDITION,
        routeData,
        userId,
      );
      meters = actualRoute.distanceInMeters;
    }
    //If there's start and finish, I take this events to calculate averageSpeed, else I assume averageSpeed is 0
    let averageSpeed = 0;
    const startEvent = expeditionEvents.filter((e) => e.type == EExpeditionUserEventType.START);
    const finishEvent = expeditionEvents.filter((e) => e.type == EExpeditionUserEventType.FINISH);
    let startDateTime = new Date();
    let endDateTime = new Date();
    if (startEvent && startEvent.length == 1 && finishEvent && finishEvent.length == 1) {
      startDateTime = expeditionEvents[0].dateTime;
      endDateTime = expeditionEvents[expeditionEvents.length - 1].dateTime;
      const durationInSeconds = (endDateTime.getTime() - startDateTime.getTime()) / 1000;
      averageSpeed = durationInSeconds > 0 ? meters / durationInSeconds : 0;
    }
    const expeditionUserRouteLogData = {
      expeditionId: expeditionId,
      userId: userId,
      actualRouteId: actualRoute ? actualRoute.id : null,
      routeIds: expedition.routeIds,
      name: expedition.name,
      description: expedition.description,
      originId: EExpeditionLogOrigin.DERSU,
      averageSpeed: averageSpeed,
      visibility: 'private',
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    };
    await this.insertExpeditionLog(tx, expeditionUserRouteLogData);
    const [expeditionUser] = await this.expeditionUserService.finishExpedition(
      tx,
      expeditionId,
      userId,
    );
    return expeditionUser;
  }
  async getExpeditionLogById(userId: string, expeditionLogId: string) {
    const builder = this.expeditionLogDb
      .read()
      .where('ExpeditionLog.id', this.expeditionLogDb.knex.raw('?', [expeditionLogId]))
      .where('ExpeditionLog.userId', this.expeditionLogDb.knex.raw('?', [userId]));

    builder.innerJoin('Route', (b) =>
      b
        .on('ExpeditionLog.actualRouteId', 'Route.id')
        .andOn('Route.userId', this.expeditionLogDb.knex.raw('?', [userId])),
    );
    const expeditionLog = await builder.then(([res]) => {
      return res
        ? AddFields.target(res).add('route', () =>
            res.actualRouteId ? this.routeService.findOne(null, res.actualRouteId) : {},
          )
        : {};
    });

    return expeditionLog;
  }
  async getUserExpeditionLog(userId: string) {
    const expeditionLogs = this.expeditionLogDb
      .read()
      .where({
        userId: userId,
      })
      .cReturning();

    return expeditionLogs;
  }
}

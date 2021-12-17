import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError } from '../../common/errors/http.error';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import {
  EExpeditionUserEventType,
  ICreateDataBaseExpeditionUserEvent,
  IDataBaseExpeditionUserEvent,
  IExpeditionUserEventData,
} from '../types/expedition-event.type';

@Injectable()
export class ExpeditionUserEventService {
  constructor(
    @InjectKnexClient('ExpeditionUserEvent')
    private db: KnexClient<'ExpeditionUserEvent'>,
  ) {}

  async insertArrayOfEvents(
    tx: TransactionManager,
    expeditionId: string,
    userId: string,
    events: IExpeditionUserEventData[],
  ): Promise<IDataBaseExpeditionUserEvent[]> {
    const existingEvents = await this.getExpeditionUserEvents(tx, expeditionId, userId, []);
    const uniqueEvents: { [index: string]: ICreateDataBaseExpeditionUserEvent } = {};
    existingEvents.forEach((e: IDataBaseExpeditionUserEvent) => {
      let coordinate;
      if (e.coordinate) {
        coordinate = this.db.knex.raw(
          `st_geomfromtext('pointz(${e.coordinate.coordinates[0]} ${e.coordinate.coordinates[1]} ${
            e.coordinate.coordinates[2] ?? 0
          })')`,
        );
      }
      const dbEvent = {
        expeditionId: e.expeditionId,
        userId: e.userId,
        type: e.type,
        dateTime: e.dateTime,
        coordinate: coordinate,
        meta: e.meta,
      };
      uniqueEvents[e.type + '_' + e.dateTime.getTime()] = dbEvent;
    });
    events.forEach((e) => {
      let coordinate;
      if (e.coordinates) {
        coordinate = this.db.knex.raw(
          `st_geomfromtext('pointz(${e.coordinates[0]} ${e.coordinates[1]} ${
            e.coordinates[2] ?? 0
          })')`,
        );
      }
      const dbEvent = {
        expeditionId: expeditionId,
        userId: userId,
        type: e.type,
        dateTime: e.dateTime,
        coordinate: coordinate,
        meta: {
          network: e.network,
          message: e.message,
        },
      };
      uniqueEvents[e.type + '_' + e.dateTime.getTime()] = dbEvent;
    });
    let eventsOfTypeStart = 0;
    let eventsOfTypeFinish = 0;
    const updates: ICreateDataBaseExpeditionUserEvent[] = [];
    Object.entries(uniqueEvents).forEach(function ([, value]) {
      if (value.type == EExpeditionUserEventType.START) {
        eventsOfTypeStart++;
      }
      if (value.type == EExpeditionUserEventType.FINISH) {
        eventsOfTypeFinish++;
      }
      updates.push(value);
    });
    //No duplicate start or finish events
    if (eventsOfTypeStart > 1 || eventsOfTypeFinish > 1) {
      throw new BadRequestError(
        ErrorCodes.DUPLICATE_EVENTS,
        'There can be neither more than one event of type START nor FINISH',
      );
    }
    await this.db
      .write(tx)
      .whereIn(
        'id',
        existingEvents.map((e) => e.id),
      )
      .del()
      .cReturning();
    const expeditionUserEvents = await this.db.write(tx).insert(updates).returning('*');

    return expeditionUserEvents;
  }
  async getExpeditionUserEvents(
    tx: TransactionManager,
    expeditionId: string,
    userId: string,
    types: string[],
  ): Promise<IDataBaseExpeditionUserEvent[]> {
    const builder = this.db
      .read(tx)
      .where({
        expeditionId: expeditionId,
        userId: userId,
      })
      .orderBy('dateTime', 'asc');
    if (types.length > 0) {
      builder.whereIn('type', types);
    }
    const expeditionUserEvents = await builder;
    return expeditionUserEvents;
  }
}

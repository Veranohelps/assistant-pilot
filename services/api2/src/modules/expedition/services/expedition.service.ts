import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError, NotFoundError } from '../../common/errors/http.error';
import { EventService } from '../../common/services/event.service';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import AddFields from '../../common/utilities/add-fields';
import { createKnexStream } from '../../common/utilities/create-knex-stream';
import { recordToArray } from '../../common/utilities/generate-record';
import { pointGeometryPlaceholder } from '../../common/utilities/gpx-to-geojson';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ActivityTypeService } from '../../route/services/activity-type.service';
import { RouteService } from '../../route/services/route.service';
import { EExpeditionEvents } from '../events/event-types/expedition.event-type';
import {
  ICreateExpedition,
  ICreateExpeditionDTO,
  IExpedition,
  IExpeditionFull,
} from '../types/expedition.type';
import { ExpeditionRouteService } from './expedition-route.service';

@Injectable()
export class ExpeditionService {
  constructor(
    @InjectKnexClient('Expedition')
    private db: KnexClient<'Expedition'>,
    private routeService: RouteService,
    private expeditionRouteService: ExpeditionRouteService,
    private activityTypeService: ActivityTypeService,
    private eventService: EventService,
  ) {}

  async validateExpeditionActivityTypes(tx: TransactionManager | null, expedition: IExpedition) {
    const expeditionRoutes = await this.expeditionRouteService
      .getRoutesSlim(tx, [expedition.id])
      .then((res) => Object.values(res).flat());
    const possibleActivities = expeditionRoutes.map((er) => er.route.activityTypeIds).flat();
    const isValid = expedition.activityTypeIds.every((id) => possibleActivities.includes(id));

    if (!isValid) {
      throw new BadRequestError(
        ErrorCodes.INVALID_EXPEDITION_ACTIVITIES,
        'The activities types for this expedition is not allowed by any of the selected routes',
      );
    }
  }

  async updateExpeditionParameters(tx: TransactionManager, expeditions: IExpedition[]) {
    const newParams = await this.expeditionRouteService.getExpeditionParameters(
      tx,
      expeditions.map((e) => e.id),
    );

    const updates: ICreateExpedition[] = expeditions.map((expedition) => {
      const params = newParams[expedition.id] ?? {};

      return {
        ...expedition,
        activityTypeIds: params.activityTypeIds,
        estimatedDurationInMinutes:
          params.durationInMinutes ?? expedition.estimatedDurationInMinutes,
        coordinate: pointGeometryPlaceholder,
      };
    });

    const updatedExpeditions = await this.db
      .write(tx)
      .insert(updates)
      .onConflict('id')
      .merge(['estimatedDurationInMinutes'] as any[])
      .cReturning();

    return updatedExpeditions;
  }

  async create(
    tx: TransactionManager,
    userId: string,
    payload: ICreateExpeditionDTO,
  ): Promise<IExpeditionFull> {
    // for now, the expedition's coordinates defaults to the coordinate of the start route
    const { routeId, startDateTime } = payload.routes[0];
    const {
      coordinates: [[longitude, latitude, altitude]],
    } = (await this.routeService.findOne(tx, routeId)).coordinate as ILineStringGeometry;
    // for backward compatibility, for now, attach t
    const [expedition] = await this.db
      .write(tx)
      .insert({
        name: payload.name,
        description: payload.description,
        activityTypeIds: payload.activityTypes,
        routeIds: payload.routes.map((r) => r.routeId),
        startDateTime: startDateTime,
        userId,
        coordinate: this.db.knex.raw(
          `ST_GeogFromText('POINTZ(${longitude} ${latitude} ${altitude ?? 0})')`,
        ),
        estimatedDurationInMinutes: 0,
      })
      .cReturning();

    await this.expeditionRouteService.addRoutes(tx, expedition.id, payload.activityTypes, {
      routes: payload.routes,
    });
    await this.updateExpeditionParameters(tx, [expedition]);

    const result = await this.getExpeditionFull(tx, expedition.id);

    return result;
  }

  async updateRouteExpeditions(tx: TransactionManager, routeIds: string[]): Promise<IExpedition[]> {
    await this.expeditionRouteService.onRouteUpdate(tx, routeIds);

    let affectedExpeditions = await this.db.write(tx).where('routeIds', '&&', routeIds);

    if (!affectedExpeditions.length) return [];

    affectedExpeditions = await this.updateExpeditionParameters(tx, affectedExpeditions);

    return affectedExpeditions;
  }

  async refreshExpedition(tx: TransactionManager, expeditionId: string): Promise<IExpedition> {
    let expedition = await this.findOne(tx, expeditionId);
    const expeditionRoutes = await this.expeditionRouteService.getExpeditionRoutesByExpedition(tx, [
      expeditionId,
    ]);

    await this.expeditionRouteService.updateExpeditionRouteParams(
      tx,
      expeditionRoutes[expeditionId],
    );

    [expedition] = await this.updateExpeditionParameters(tx, [expedition]);

    return expedition;
  }

  async refreshAllExpeditions(tx: TransactionManager): Promise<boolean> {
    await createKnexStream(this.db.read(tx), async (expeditions) => {
      const expeditionRoutes = await this.expeditionRouteService
        .getExpeditionRoutesByExpedition(
          tx,
          expeditions.map((e) => e.id),
        )
        .then(recordToArray);
      await this.expeditionRouteService.updateExpeditionRouteParams(tx, expeditionRoutes.flat());
      await this.updateExpeditionParameters(tx, expeditions);
    });

    return true;
  }

  async deleteRoutesFromExpeditions(tx: TransactionManager, routeIds: string[]): Promise<void> {
    await this.expeditionRouteService.deleteByRoutes(tx, routeIds);

    const updated = await this.db
      .write(tx)
      .where('routeIds', '&&', routeIds)
      .update({
        routeIds: this.db.knex.raw(
          'SELECT array(SELECT unnest(??) except SELECT json_array_elements_text(?))',
          ['routeIds', JSON.stringify(routeIds)],
        ) as any,
      })
      .cReturning();

    await this.updateExpeditionParameters(tx, updated);
  }

  async deleteUserExpeditions(tx: TransactionManager, userId: string): Promise<IExpedition[]> {
    const expeditions = await this.db.read(tx).where({ userId });

    if (!expeditions.length) return [];

    await this.eventService.emitAsync(EExpeditionEvents.DELETE_EXPEDITIONS, {
      tx,
      expeditions,
      userId,
    });
    await this.expeditionRouteService.deleteByRoutes(
      tx,
      expeditions.map((e) => e.id),
    );
    await this.db.write(tx).where({ userId }).del().cReturning();

    return expeditions;
  }

  async findOne(tx: TransactionManager | null, id: string, userId?: string): Promise<IExpedition> {
    const builder = this.db.read(tx).where({ id }).first();

    if (userId) builder.where({ userId });

    const expedition = await builder;

    if (!expedition) {
      throw new NotFoundError(ErrorCodes.EXPEDITION_NOT_FOUND, 'Expedition not found');
    }

    return expedition;
  }

  async getExpeditionFull(
    tx: TransactionManager | null,
    id: string,
    userId?: string,
  ): Promise<IExpeditionFull> {
    const expedition = await this.findOne(tx, id, userId);
    const expeditionRoutes = await this.expeditionRouteService.getWithRoutes(tx, [id]);
    const result = await AddFields.target(expedition)
      .add('routes', () => expeditionRoutes[expedition.id].map((eR) => eR.route))
      .add('activityTypes', () =>
        Object.values(this.activityTypeService.findByIds(expedition.activityTypeIds)),
      )
      .add('expeditionRoutes', () => expeditionRoutes[expedition.id]);

    return result;
  }

  async getExpeditionsFull(userId?: string): Promise<IExpeditionFull[]> {
    const builder = this.db.read();

    if (userId) builder.where({ userId });

    const expeditions = await builder.then(async (res) => {
      const expeditionRoutes = await this.expeditionRouteService.getRoutesSlim(
        null,
        res.map((e) => e.id),
      );

      return AddFields.target(res)
        .add(
          'routes',
          () => expeditionRoutes,
          (exp, record) => record[exp.id].map((er) => er.route),
        )
        .add('activityTypes', () =>
          Object.values(
            this.activityTypeService.findByIds(res.map((e) => e.activityTypeIds).flat()),
          ),
        )
        .add(
          'expeditionRoutes',
          () => expeditionRoutes,
          (exp, record) => record[exp.id],
        );
    });

    return expeditions;
  }

  async getExpeditions(): Promise<IExpedition[]> {
    const expeditions = await this.db.read();

    return expeditions;
  }

  async getUpcomingExpeditions(userId: string): Promise<IExpedition[]> {
    const expeditions = await this.db
      .read()
      .where('startDateTime', '>=', new Date())
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .then((res) =>
        AddFields.target(res).add('activityTypes', () =>
          Object.values(
            this.activityTypeService.findByIds(res.map((e) => e.activityTypeIds).flat()),
          ),
        ),
      );

    return expeditions;
  }
}

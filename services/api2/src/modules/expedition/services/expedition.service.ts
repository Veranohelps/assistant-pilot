import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError, NotFoundError } from '../../common/errors/http.error';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import AddFields from '../../common/utilities/add-fields';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ActivityTypeService } from '../../route/services/activity-type.service';
import { RouteService } from '../../route/services/route.service';
import { ICreateExpeditionDTO, IExpedition, IExpeditionFull } from '../types/expedition.type';
import { ExpeditionRouteService } from './expedition-route.service';

@Injectable()
export class ExpeditionService {
  constructor(
    @InjectKnexClient('Expedition')
    private db: KnexClient<'Expedition'>,
    private routeService: RouteService,
    private expeditionRouteService: ExpeditionRouteService,
    private activityTypeService: ActivityTypeService,
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
    const [{ id }] = await this.db
      .write(tx)
      .insert({
        name: payload.name,
        description: payload.description,
        activityTypeIds: payload.activityTypes,
        startDateTime: startDateTime,
        userId,
        coordinate: this.db.knex.raw(
          `ST_GeogFromText('POINTZ(${longitude} ${latitude} ${altitude ?? 0})')`,
        ),
      })
      .cReturning();
    await this.expeditionRouteService.addRoutes(tx, id, {
      routes: payload.routes,
    });

    const result = await this.getExpeditionFull(tx, id);

    return result;
  }

  async getExpeditionFull(
    tx: TransactionManager | null,
    id: string,
    userId?: string,
  ): Promise<IExpeditionFull> {
    const builder = this.db.read(tx).where({ id }).first();

    if (userId) builder.where({ userId });

    const expedition = await builder;

    if (!expedition) {
      throw new NotFoundError(ErrorCodes.EXPEDITION_NOT_FOUND, 'Expedition not found');
    }

    const result = await AddFields.target(expedition)
      .add('routes', () =>
        this.expeditionRouteService
          .getWithRoutes(tx, [id])
          .then((eRs) => eRs[expedition.id].map((eR) => eR.route)),
      )
      .add('activityTypes', () =>
        Object.values(this.activityTypeService.findByIds(expedition.activityTypeIds)),
      );

    return result;
  }

  async getExpeditionsFull(userId?: string): Promise<IExpeditionFull[]> {
    const builder = this.db.read();

    if (userId) builder.where({ userId });

    const expeditions = await builder.then((res) =>
      AddFields.target(res)
        .add(
          'routes',
          () =>
            this.expeditionRouteService.getRoutesSlim(
              null,
              res.map((e) => e.id),
            ),
          (exp, record) => record[exp.id].map((er) => er.route),
        )
        .add('activityTypes', () =>
          Object.values(
            this.activityTypeService.findByIds(res.map((e) => e.activityTypeIds).flat()),
          ),
        ),
    );

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
  async getExpeditionsFromUser(userId: string): Promise<string[]> {
    const expeditionsIds = (await this.db.read().where({ userId })).map((e) => e.id);

    return expeditionsIds;
  }
  async deleteUserExpeditions(tx: TransactionManager, userId: string): Promise<IExpedition[]> {
    const expeditionsIds = await this.getExpeditionsFromUser(userId);
    await this.expeditionRouteService.deleteAllRoutesFromExpeditions(tx, expeditionsIds);
    const deleted = await this.db.write(tx).where({ userId }).del().cReturning();

    return deleted;
  }
}

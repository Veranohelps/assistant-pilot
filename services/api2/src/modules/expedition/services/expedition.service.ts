import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TWithUrl } from '../../../types/helpers.type';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { generateGroupRecord2 } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { RouteService } from '../../route/services/route.service';
import {
  ICreateExpeditionDTO,
  IExpedition,
  IExpeditionFull,
  IExpeditionFullSlim,
} from '../types/expedition.type';
import { ExpeditionRouteService } from './expedition-route.service';

@Injectable()
export class ExpeditionService {
  constructor(
    @InjectKnexClient('Expedition')
    private db: KnexClient<'Expedition'>,
    private routeService: RouteService,
    private expeditionRouteService: ExpeditionRouteService,
    private configService: ConfigService,
  ) {}

  async create(
    tx: TransactionManager,
    userId: string,
    payload: ICreateExpeditionDTO,
  ): Promise<IExpeditionFull> {
    // for now, the expedition's coordinates defaults to the coordinate of the start route
    const { routeId, startDateTime } = payload.routes[0];
    const {
      coordinate: {
        coordinates: [[longitude, latitude, altitude]],
      },
    } = await this.routeService.findOne(tx, routeId);
    const [{ id }] = await this.db
      .write(tx)
      .insert({
        name: payload.name,
        description: payload.description,
        startDateTime: startDateTime,
        userId,
        coordinate: this.db.knex.raw(
          `ST_GeogFromText('POINTZ(${longitude} ${latitude} ${altitude ?? 0})')`,
        ),
      })
      .returning('*');
    await this.expeditionRouteService.addRoutes(tx, id, {
      routes: payload.routes,
    });

    const result: IExpeditionFull = await this.getExpeditionFull(tx, id);

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

    const expeditionRoutes = await this.expeditionRouteService.getWithRoutes(tx, id);

    const result = {
      ...expedition,
      routes: expeditionRoutes.map((e) => e.route),
    };

    return result;
  }

  async getExpeditionsFull(namespace: string, userId?: string): Promise<IExpeditionFullSlim[]> {
    const builder = this.db.read();

    if (userId) builder.where({ userId });

    const expeditions = await builder;
    const expeditionRoutes = await this.expeditionRouteService
      .getRoutesSlim(
        null,
        expeditions.map((e) => e.id),
        namespace,
      )
      .then(generateGroupRecord2((e) => e.expeditionId));

    const result = expeditions.map<IExpeditionFullSlim>((expedition) => ({
      ...expedition,
      routes: expeditionRoutes[expedition.id].map((e) => e.route).flat(),
    }));

    return result;
  }

  appendUrl(expedition: IExpedition): TWithUrl<IExpedition>;
  appendUrl(expeditions: IExpedition[]): TWithUrl<IExpedition>[];
  appendUrl(
    expeditions: IExpedition | IExpedition[],
  ): TWithUrl<IExpedition>[] | TWithUrl<IExpedition> {
    if (Array.isArray(expeditions)) {
      return expeditions.map((expedition) => ({
        ...expedition,
        url: `${this.configService.get('APP_URL')}/personal/expedition/${expedition.id}`,
      }));
    }

    return {
      ...expeditions,
      url: `${this.configService.get('APP_URL')}/personal/expedition/${expeditions.id}`,
    };
  }

  async getExpeditions(): Promise<IExpedition[]> {
    const expeditions = await this.db.read();

    return this.appendUrl(expeditions);
  }

  async getUpcomingExpeditions(userId: string): Promise<TWithUrl<IExpedition>[]> {
    const expeditions = await this.db
      .read()
      .where('startDateTime', '>=', new Date())
      .where({ userId })
      .orderBy('createdAt', 'desc');

    return this.appendUrl(expeditions);
  }
}

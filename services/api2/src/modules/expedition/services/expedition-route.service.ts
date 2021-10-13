import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DataLoader from 'dataloader';
import { ensureArray } from '../../common/utilities/ensure-array';
import { generateGroupRecord2, generateRecord2 } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { RouteService } from '../../route/services/route.service';
import { IRoute } from '../../route/types/route.type';
import {
  ICreateExpeditionRoutesDTO,
  IExpeditionRoute,
  IExpeditionRouteWithRoute,
  IExpeditionRouteWithRouteSlim,
} from '../types/expedition-route.type';

@Injectable()
export class ExpeditionRouteService {
  constructor(
    @InjectKnexClient('ExpeditionRoute')
    private db: KnexClient<'ExpeditionRoute'>,
    private routeService: RouteService,
    private configService: ConfigService,
  ) {}

  async addRoutes(
    tx: TransactionManager,
    expeditionId: string,
    payload: ICreateExpeditionRoutesDTO,
  ): Promise<IExpeditionRoute[]> {
    const expeditionRoutes = await this.db
      .write(tx)
      .insert(
        payload.routes.map(({ routeId, startDateTime, durationInHours }) => ({
          expeditionId,
          routeId,
          startDateTime,
          durationInHours,
        })),
      )
      .returning('*');

    return expeditionRoutes;
  }

  async getRoutesSlim(
    tx: TransactionManager | null,
    expeditionId: string | string[],
    namespace: string,
  ): Promise<IExpeditionRouteWithRouteSlim[]> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', ensureArray(expeditionId));
    const routes = await this.routeService
      .findByIdsSlim(
        tx,
        expeditionRoutes.map((e) => e.routeId),
      )
      .then(generateRecord2((r) => r.id));
    const result = expeditionRoutes.map<IExpeditionRouteWithRouteSlim>((e) => {
      const route = routes[e.routeId];

      return {
        ...e,
        route: {
          ...route,
          url: `${this.configService.get('APP_URL')}/${namespace}/route/${route.id}`,
        },
      };
    });

    return result;
  }

  async getWithRoutes(
    tx: TransactionManager | null,
    expeditionId: string | string[],
  ): Promise<IExpeditionRouteWithRoute[]> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', ensureArray(expeditionId));
    const routes = await this.routeService
      .findByIds(
        tx,
        expeditionRoutes.map((e) => e.routeId),
      )
      .then(generateRecord2((r) => r.id));

    return expeditionRoutes.map((er) => ({ ...er, route: routes[er.routeId] }));
  }

  getRoutesLoader: DataLoader<string, IRoute[]> = new DataLoader(
    async (ids) => {
      const record = await this.getWithRoutes(null, ids as string[]).then(
        generateGroupRecord2((r) => r.expeditionId),
      );

      return ids.map((id) => record[id].map((er) => er.route) ?? []);
    },
    { cache: false },
  );
}

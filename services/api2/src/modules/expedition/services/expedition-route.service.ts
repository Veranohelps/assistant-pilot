import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DataLoader from 'dataloader';
import { ensureArray } from '../../common/utilities/ensure-array';
import {
  generateGroupRecord,
  generateGroupRecord2,
  generateRecord2,
} from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { RouteService } from '../../route/services/route.service';
import { IRoute } from '../../route/types/route.type';
import { IExpeditionRoute, IExpeditionRouteFull } from '../types/expedition-route.type';

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
    routeIds: string[],
  ): Promise<IExpeditionRoute[]> {
    const expeditionRoutes = await this.db
      .write(tx)
      .insert(
        routeIds.map((routeId) => ({
          expeditionId,
          routeId,
        })),
      )
      .returning('*');

    return expeditionRoutes;
  }

  async getRoutes(
    tx: TransactionManager | null,
    expeditionId: string | string[],
    namespace: string,
  ): Promise<IExpeditionRouteFull[]> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', ensureArray(expeditionId));
    const routes = await this.routeService
      .findByIds(
        tx,
        expeditionRoutes.map((e) => e.routeId),
      )
      .then(generateGroupRecord2((r) => r.id));
    const result = expeditionRoutes.map<IExpeditionRouteFull>((e) => ({
      ...e,
      routes: routes[e.routeId].map((r) => ({
        id: r.id,
        url: `${this.configService.get('APP_URL')}/${namespace}/route/${r.id}`,
      })),
    }));

    return result;
  }

  async getRoutes2(
    tx: TransactionManager | null,
    expeditionId: string | string[],
  ): Promise<Record<string, IRoute[]>> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', ensureArray(expeditionId));
    const routes = await this.routeService
      .findByIds(
        tx,
        expeditionRoutes.map((e) => e.routeId),
      )
      .then(generateRecord2((r) => r.id));
    const result = generateGroupRecord(
      expeditionRoutes,
      (e) => e.expeditionId,
      (e) => routes[e.routeId],
    );

    return result;
  }

  getRoutesLoader: DataLoader<string, IRoute[]> = new DataLoader(
    async (ids) => {
      const record = await this.getRoutes2(null, ids as string[]);

      return ids.map((id) => record[id] ?? []);
    },
    { cache: false },
  );
}

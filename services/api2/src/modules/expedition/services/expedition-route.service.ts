import { forwardRef, Inject, Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import AddFields from '../../common/utilities/add-fields';
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
    @Inject(forwardRef(() => RouteService))
    private routeService: RouteService,
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
      .cReturning();

    return expeditionRoutes;
  }

  async getRoutesSlim(
    tx: TransactionManager | null,
    expeditionId: string | string[],
  ): Promise<IExpeditionRouteWithRouteSlim[]> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', ensureArray(expeditionId))
      .then((res) =>
        AddFields.target(res).add(
          'route',
          () =>
            this.routeService
              .findByIdsSlim(
                tx,
                res.map((e) => e.routeId),
              )
              .then(generateRecord2((r) => r.id)),
          (er, record) => record[er.routeId],
        ),
      );

    return expeditionRoutes;
  }

  async getWithRoutes(
    tx: TransactionManager | null,
    expeditionId: string | string[],
  ): Promise<IExpeditionRouteWithRoute[]> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', ensureArray(expeditionId));
    const routes = await this.routeService
      .findByIdsWithWaypoints(
        tx,
        expeditionRoutes.map((e) => e.routeId),
      )
      .then(generateRecord2((r) => r.id));

    return expeditionRoutes.map((er) => ({ ...er, route: routes[er.routeId] }));
  }

  async deleteRouteFromExpeditions(
    tx: TransactionManager,
    routeId: string,
  ): Promise<IExpeditionRoute[]> {
    const deleted = await this.db.write(tx).where({ routeId }).del().cReturning();

    return deleted;
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

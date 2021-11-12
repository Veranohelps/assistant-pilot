import { forwardRef, Inject, Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { SRecord } from '../../../types/helpers.type';
import AddFields from '../../common/utilities/add-fields';
import {
  generateGroupRecord2,
  generateRecord,
  generateRecord2,
} from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { RouteActivityTypeService } from '../../route/services/route-activity-type.service';
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
    private routeActivityTypeService: RouteActivityTypeService,
  ) {}

  async addRoutes(
    tx: TransactionManager,
    expeditionId: string,
    activityTypeIds: string[],
    payload: ICreateExpeditionRoutesDTO,
  ): Promise<IExpeditionRoute[]> {
    const routeActivities = await this.routeActivityTypeService.getActivitiesByRouteIds(
      tx,
      payload.routes.map((r) => r.routeId),
    );

    const entries = payload.routes.map((route) => {
      const routeActivity = generateRecord(
        routeActivities[route.routeId],
        (a) => a.activityTypeId,
        () => true,
      );

      return {
        expeditionId,
        routeId: route.routeId,
        startDateTime: route.startDateTime,
        activityTypeIds: activityTypeIds.filter((id) => routeActivity[id]),
      };
    });

    const expeditionRoutes = await this.db.write(tx).insert(entries).cReturning();

    return expeditionRoutes;
  }

  async onRouteUpdate(tx: TransactionManager, routeId: string) {
    const routeActivities = await this.routeActivityTypeService
      .getRouteActivities(tx, routeId)
      .then(generateRecord2((a) => a.activityTypeId));
    const expeditionRoutes = await this.db.read(tx).where({ routeId });

    const entries = expeditionRoutes.map((er) => {
      const typeIds = er.activityTypeIds.filter((id) => routeActivities[id]);

      return { ...er, activityTypeIds: typeIds };
    });

    const updates = await this.db
      .write(tx)
      .insert(entries)
      .onConflict(['expeditionId', 'routeId'])
      .merge()
      .cReturning();

    return updates;
  }

  async getRoutesSlim(
    tx: TransactionManager | null,
    expeditionIds: string[],
  ): Promise<SRecord<IExpeditionRouteWithRouteSlim[]>> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', expeditionIds)
      .then((res) =>
        AddFields.target(res).add(
          'route',
          () =>
            this.routeService.findByIdsSlim(
              tx,
              res.map((e) => e.routeId),
            ),
          (er, record) => record[er.routeId],
        ),
      )
      .then(generateGroupRecord2((er) => er.expeditionId));

    return expeditionRoutes;
  }

  async getWithRoutes(
    tx: TransactionManager | null,
    expeditionIds: string[],
  ): Promise<SRecord<IExpeditionRouteWithRoute[]>> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', expeditionIds)
      .then((res) =>
        AddFields.target(res).add(
          'route',
          () =>
            this.routeService.findByIdsWithWaypoints(
              tx,
              res.map((e) => e.routeId),
            ),
          (er, group) => group[er.routeId],
        ),
      )
      .then(generateGroupRecord2((er) => er.expeditionId));

    return expeditionRoutes;
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
      const record = await this.getWithRoutes(null, ids as string[]);

      return ids.map((id) => record[id].map((er) => er.route) ?? []);
    },
    { cache: false },
  );

  async deleteAllRoutesFromExpeditions(
    tx: TransactionManager,
    expeditionIds: string[],
  ): Promise<IExpeditionRoute[]> {
    const deleted = await this.db
      .write(tx)
      .whereIn('expeditionId', expeditionIds)
      .del()
      .cReturning();

    return deleted;
  }
}

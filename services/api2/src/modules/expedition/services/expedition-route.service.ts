import { forwardRef, Inject, Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { mapValues, uniq } from 'lodash';
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
import {
  IRouteActivityType,
  TEstimatedTimeToMPI,
} from '../../route/types/route-activity-type.type';
import { IRoute } from '../../route/types/route.type';
import {
  ICreateExpeditionRoute,
  ICreateExpeditionRoutesDTO,
  IExpeditionRoute,
  IExpeditionRouteParameters,
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

  getTimeEstimates(routeActivities: IRouteActivityType[]) {
    const estimatedDurationInMinutes = Math.max(
      ...routeActivities.map((a) => a.estimatedDurationInMinutes),
      0,
    );
    const estimateDurationToMPIMap = new Map<number, TEstimatedTimeToMPI>();

    routeActivities.forEach((rA) => {
      rA.estimatedDurationToMeteoPointsOfInterestsInMinutes.forEach((estimate) => {
        const key = estimate.coordinate[2] as number;
        const durationToMPI = estimateDurationToMPIMap.get(key);

        if (!durationToMPI || durationToMPI.estimatedTime < estimate.estimatedTime) {
          estimateDurationToMPIMap.set(key, {
            coordinate: estimate.coordinate,
            estimatedTime: estimate.estimatedTime,
          });
        }
      });
    });

    return {
      estimatedDurationInMinutes,
      estimatedDurationToMeteoPointsOfInterestsInMinutes: Array.from(
        estimateDurationToMPIMap.values(),
      ),
    };
  }

  async addRoutes(
    tx: TransactionManager,
    expeditionId: string,
    activityTypeIds: string[],
    payload: ICreateExpeditionRoutesDTO,
  ): Promise<IExpeditionRoute[]> {
    const activities = await this.routeActivityTypeService.getActivitiesByRouteIds(
      tx,
      payload.routes.map((r) => r.routeId),
    );
    const entries = payload.routes.map((route): ICreateExpeditionRoute => {
      const expeditionRouteActivities = activities[route.routeId].filter((rA) =>
        activityTypeIds.includes(rA.activityTypeId),
      );

      return {
        expeditionId,
        routeId: route.routeId,
        startDateTime: route.startDateTime,
        activityTypeIds: expeditionRouteActivities.map((rA) => rA.activityTypeId),
        ...this.getTimeEstimates(expeditionRouteActivities),
      };
    });

    const expeditionRoutes = await this.db.write(tx).insert(entries).cReturning();

    return expeditionRoutes;
  }

  async updateRoutes(
    tx: TransactionManager,
    expeditionId: string,
    activityTypeIds: string[],
    payload: ICreateExpeditionRoutesDTO,
  ): Promise<IExpeditionRoute[]> {
    const updateRecord = generateRecord(payload.routes, (r) => r.routeId);
    const expeditionRoutes = await this.db.read(tx).where({ expeditionId });
    const activities = await this.routeActivityTypeService.getActivitiesByRouteIds(
      tx,
      expeditionRoutes.map((er) => er.routeId),
    );

    const entries = expeditionRoutes.map((er): ICreateExpeditionRoute => {
      const { startDateTime } = updateRecord[er.routeId];
      const expeditionRouteActivities = activities[er.routeId].filter((rA) =>
        activityTypeIds.includes(rA.activityTypeId),
      );

      return {
        expeditionId,
        routeId: er.routeId,
        startDateTime: startDateTime ?? er.startDateTime,
        activityTypeIds: expeditionRouteActivities.map((rA) => rA.activityTypeId),
        ...this.getTimeEstimates(expeditionRouteActivities),
      };
    });

    const updatedExpeditionRoutes = await this.db
      .write(tx)
      .insert(entries)
      .onConflict(['routeId', 'expeditionId'])
      .merge()
      .cReturning();

    return updatedExpeditionRoutes;
  }

  async updateExpeditionRouteParams(
    tx: TransactionManager,
    expeditionRoutes: IExpeditionRoute[],
  ): Promise<IExpeditionRoute[]> {
    /**
     * transform the route activity dictionary from
     *  { [routeId]: {routeActivity} } to { [routeId]: { [activityTypeId]: {routeActivity} } }
     */
    const routeActivities = await this.routeActivityTypeService
      .getActivitiesByRouteIds(
        tx,
        expeditionRoutes.map((er) => er.routeId),
      )
      .then((res) =>
        mapValues(
          res,
          generateRecord2((a) => a.activityTypeId),
        ),
      );
    const entries = expeditionRoutes.map((er): ICreateExpeditionRoute => {
      const expeditionRouteActivities = er.activityTypeIds
        .map((id) => routeActivities[er.routeId][id])
        .filter((rA) => !!rA);

      return {
        expeditionId: er.expeditionId,
        routeId: er.routeId,
        startDateTime: er.startDateTime,
        activityTypeIds: expeditionRouteActivities.map((rA) => rA.activityTypeId),
        ...this.getTimeEstimates(expeditionRouteActivities),
      };
    });

    const updates = await this.db
      .write(tx)
      .insert(entries)
      .onConflict(['expeditionId', 'routeId'])
      .merge()
      .cReturning();

    return updates;
  }

  async onRouteUpdate(tx: TransactionManager, routeIds: string[]): Promise<IExpeditionRoute[]> {
    const expeditionRoutes = await this.db.read(tx).whereIn('routeId', routeIds);

    if (!expeditionRoutes.length) return [];

    const updates = await this.updateExpeditionRouteParams(tx, expeditionRoutes);

    return updates;
  }

  async deleteByRoutes(tx: TransactionManager, routeIds: string[]): Promise<IExpeditionRoute[]> {
    const deleted = await this.db.write(tx).whereIn('routeId', routeIds).del().cReturning();

    return deleted;
  }

  async deleteByExpeditions(
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

  async getExpeditionRoutesByExpedition(
    tx: TransactionManager | null,
    expeditionIds: string[],
  ): Promise<SRecord<IExpeditionRoute[]>> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', expeditionIds)
      .then(generateGroupRecord2((er) => er.expeditionId));

    return expeditionRoutes;
  }

  async getExpeditionParameters(
    tx: TransactionManager | null,
    expeditionIds: string[],
  ): Promise<SRecord<IExpeditionRouteParameters>> {
    if (!expeditionIds.length) return {};

    const params = await this.db
      .knex('ExpeditionRoute')
      .tx(tx)
      .whereIn('expeditionId', expeditionIds)
      .select('expeditionId')
      .max('estimatedDurationInMinutes', { as: 'durationInMinutes' })
      .select({ activityTypeIds: this.db.knex.raw(`array_agg("activityTypeIds")`) })
      .groupBy('expeditionId')
      .then(
        generateRecord2(
          (agg) => agg.expeditionId,
          (agg): IExpeditionRouteParameters => ({
            durationInMinutes: agg.durationInMinutes as number,
            expeditionId: agg.expeditionId,
            activityTypeIds: uniq(agg.activityTypeIds.flat()),
          }),
        ),
      );

    return params;
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

  getRoutesLoader: DataLoader<string, IRoute[]> = new DataLoader(
    async (ids) => {
      const record = await this.getWithRoutes(null, ids as string[]);

      return ids.map((id) => record[id].map((er) => er.route) ?? []);
    },
    { cache: false },
  );
}

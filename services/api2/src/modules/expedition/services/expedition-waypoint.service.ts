import { Injectable } from '@nestjs/common';
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
import { WaypointService } from '../../waypoint/services/waypoint.service';
import { IWaypoint } from '../../waypoint/types/waypoint.type';
import { IExpeditionWaypoint, IExpeditionWaypointFull } from '../types/expedition-waypoint.type';

@Injectable()
export class ExpeditionWaypointService {
  constructor(
    @InjectKnexClient('ExpeditionWaypoint')
    private db: KnexClient<'ExpeditionWaypoint'>,
    private waypointService: WaypointService,
  ) {}

  async addWaypoints(
    tx: TransactionManager,
    expeditionId: string,
    waypointIds: string[],
  ): Promise<IExpeditionWaypoint[]> {
    if (waypointIds.length === 0) {
      return [];
    }

    const expeditionWaypoints = await this.db
      .write(tx)
      .insert(
        waypointIds.map((waypointId) => ({
          expeditionId,
          waypointId,
        })),
      )
      .returning('*');

    return expeditionWaypoints;
  }

  async getWaypoints(
    tx: TransactionManager | null,
    expeditionId: string | string[],
  ): Promise<IExpeditionWaypointFull[]> {
    const expeditionWaypoints = await this.db
      .read(tx)
      .whereIn('expeditionId', ensureArray(expeditionId));
    const waypoints = await this.waypointService
      .findByIds(
        tx,
        expeditionWaypoints.map((e) => e.waypointId),
      )
      .then(generateGroupRecord2((w) => w.id));

    const result = expeditionWaypoints.map<IExpeditionWaypointFull>((e) => ({
      ...e,
      waypoints: waypoints[e.waypointId],
    }));

    return result;
  }

  async getExpeditionsWaypoints(
    tx: TransactionManager | null,
    expeditionId: string | string[],
  ): Promise<Record<string, IWaypoint[]>> {
    const expeditionRoutes = await this.db
      .read(tx)
      .whereIn('expeditionId', ensureArray(expeditionId));
    const routes = await this.waypointService
      .findByIds(
        tx,
        expeditionRoutes.map((e) => e.waypointId),
      )
      .then(generateRecord2((r) => r.id));
    const result = generateGroupRecord(
      expeditionRoutes,
      (e) => e.expeditionId,
      (e) => routes[e.waypointId],
    );

    return result;
  }

  getWaypointsLoader: DataLoader<string, IWaypoint[]> = new DataLoader(
    async (ids) => {
      const record = await this.getExpeditionsWaypoints(null, ids as string[]);

      return ids.map((id) => record[id] ?? []);
    },
    { cache: false },
  );
}

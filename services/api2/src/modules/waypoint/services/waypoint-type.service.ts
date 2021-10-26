import { Injectable } from '@nestjs/common';
import { generateRecord, generateRecord2 } from '../../common/utilities/generate-record';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IWaypointType } from '../types/waypoint-type.type';

@Injectable()
export class WaypointTypeService {
  private cachedTypes: Record<string, IWaypointType> = {};

  constructor(
    @InjectKnexClient('WaypointType')
    private db: KnexClient<'WaypointType'>,
  ) {}

  all(): IWaypointType[] {
    return Object.values(this.cachedTypes);
  }

  findByIds(ids: string[]): Record<string, IWaypointType> {
    return generateRecord(
      ids.map((id) => this.cachedTypes[id]),
      (t) => t.id,
    );
  }

  async onModuleInit() {
    this.cachedTypes = await this.db.read().then(generateRecord2((t) => t.id));
  }
}

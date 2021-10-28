import { Injectable } from '@nestjs/common';
import { generateRecord, generateRecord2 } from '../../common/utilities/generate-record';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IActivityType } from '../types/activity-type.type';

@Injectable()
export class ActivityTypeService {
  private cachedTypes: Record<string, IActivityType> = {};

  constructor(
    @InjectKnexClient('ActivityType')
    private db: KnexClient<'ActivityType'>,
  ) {}

  all(): IActivityType[] {
    return Object.values(this.cachedTypes);
  }

  findByIds(ids: string[]): Record<string, IActivityType> {
    return generateRecord(
      ids.map((id) => this.cachedTypes[id]),
      (t) => t.id,
    );
  }

  async onModuleInit() {
    this.cachedTypes = await this.db.read().then(generateRecord2((t) => t.id));
  }
}

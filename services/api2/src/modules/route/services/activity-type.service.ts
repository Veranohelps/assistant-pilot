import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import {
  generateGroupRecord,
  generateRecord,
  generateRecord2,
} from '../../common/utilities/generate-record';
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
    const record = generateRecord(
      ids,
      (id) => id,
      (id) => {
        if (!this.cachedTypes[id]) {
          throw new NotFoundError(ErrorCodes.ACTIVITY_TYPE_NOT_FOUND, 'Activity type not found');
        }

        return this.cachedTypes[id];
      },
    );

    return record;
  }

  getSkillsActivities(skillIds: string[]): Record<string, IActivityType[]> {
    const skillIdRecord = generateRecord(
      Object.values(this.cachedTypes).filter((t) => !!t.skillId),
      (type) => type.skillId as string,
    );

    return generateGroupRecord(
      skillIds,
      (sId) => sId,
      (sId) => skillIdRecord[sId] ?? undefined,
    );
  }

  async onModuleInit() {
    this.cachedTypes = await this.db.read().then(generateRecord2((t) => t.id));
  }
}

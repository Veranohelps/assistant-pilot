import { Injectable } from '@nestjs/common';
import { SRecord } from '../../../types/helpers.type';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import allExists from '../../common/utilities/all-exists';
import { generateRecord } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ISkillLevel } from '../types/skill-level.type';

@Injectable()
export class SkillLevelService {
  constructor(
    @InjectKnexClient('SkillLevel')
    private db: KnexClient<'SkillLevel'>,
  ) {}

  async findOne(tx: TransactionManager | null, id: string): Promise<ISkillLevel> {
    const level = await this.db.read(tx).where({ id }).first();

    if (!level) {
      throw new NotFoundError(ErrorCodes.SKILL_LEVEL_NOT_FOUND, 'Skill level not found');
    }

    return level;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<SRecord<ISkillLevel>> {
    const levels = await this.db.read(tx).whereIn('id', ids);

    const record = generateRecord(levels, (l) => l.id);

    allExists(
      ids,
      record,
      new NotFoundError(ErrorCodes.SKILL_LEVEL_NOT_FOUND, 'Skill level not found'),
    );

    return record;
  }

  async getLevels(id: string): Promise<ISkillLevel> {
    const level = await this.findOne(null, id);

    return level;
  }

  async getAllLevels(): Promise<ISkillLevel[]> {
    const levels = await this.db.read();

    return levels;
  }
}

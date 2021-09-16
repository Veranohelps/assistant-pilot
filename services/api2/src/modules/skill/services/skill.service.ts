import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ISkill } from '../types/skill.type';
import { SkillLevelService } from './skill-level.service';

@Injectable()
export class SkillService {
  constructor(
    @InjectKnexClient('Skill')
    private db: KnexClient<'Skill'>,
    private skillLevelService: SkillLevelService,
  ) {}

  async findOne(tx: TransactionManager | null, id: string): Promise<ISkill> {
    const skill = await this.db.read(tx).where({ id }).first();

    if (!skill) {
      throw new NotFoundError(ErrorCodes.SKILL_NOT_FOUND, 'Skill not found');
    }

    return skill;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<ISkill[]> {
    const skills = await this.db.read(tx).whereIn('id', ids);

    return skills;
  }

  async getSkill(id: string): Promise<ISkill> {
    const skill = await this.findOne(null, id);

    return skill;
  }

  async getAllSkills(): Promise<ISkill[]> {
    const skills = await this.db.read();

    return skills;
  }
}

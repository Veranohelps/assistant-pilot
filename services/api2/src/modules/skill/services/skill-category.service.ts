import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ISkillCategory } from '../types/skill-category.type';
import { SkillService } from './skill.service';

@Injectable()
export class SkillCategoryService {
  constructor(
    @InjectKnexClient('SkillCategory')
    private db: KnexClient<'SkillCategory'>,
    private skillService: SkillService,
  ) {}

  async findOne(tx: TransactionManager | null, id: string): Promise<ISkillCategory> {
    const category = await this.db.read(tx).where({ id }).first();

    if (!category) {
      throw new NotFoundError(ErrorCodes.SKILL_CATEGORY_NOT_FOUND, 'Skill category not found');
    }

    return category;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<ISkillCategory[]> {
    const categories = await this.db.read(tx).whereIn('id', ids);

    return categories;
  }

  async getCategory(id: string): Promise<ISkillCategory> {
    const category = await this.findOne(null, id);

    return category;
  }

  async getCategories(): Promise<ISkillCategory[]> {
    const categories = await this.db.read();

    return categories;
  }
}

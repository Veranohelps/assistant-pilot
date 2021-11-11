import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { generateRecord2 } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { SkillLevelService } from '../../skill/services/skill-level.service';
import { IUserLevel } from '../types/user-level.type';
import { AssessmentHistoryService } from './assessment-history.service';

@Injectable()
export class UserLevelService {
  constructor(
    @InjectKnexClient('UserLevel')
    private db: KnexClient<'UserLevel'>,
    private assessmentHistoryService: AssessmentHistoryService,
    private skillLevelService: SkillLevelService,
  ) {}

  async create(
    tx: TransactionManager,
    userId: string,
    assessmentId: string,
    levelIds: string[],
  ): Promise<IUserLevel[]> {
    const levels = Object.values(await this.skillLevelService.findByIds(tx, levelIds));

    if (!levels.length) {
      throw new NotFoundError(ErrorCodes.SKILL_LEVEL_NOT_FOUND, 'Skill level not found');
    }

    const results = await this.db
      .write(tx)
      .insert(
        levels.map((l) => ({
          assessmentId,
          skillId: l.skillId,
          levelId: l.id,
          userId,
          createdAt: new Date(),
        })),
      )
      .onConflict(['skillId', 'userId'])
      .merge()
      .cReturning();

    // push new results to history
    await this.assessmentHistoryService.create(tx, userId, assessmentId, levels);

    return results;
  }

  async getUserAssessment(tx: TransactionManager | null, userId: string): Promise<IUserLevel[]> {
    const results = await this.db.read(tx).where({ userId: userId });

    return results;
  }

  async getCurrentUserLevels(
    tx: TransactionManager | null,
    userId: string,
  ): Promise<Record<string, string>> {
    const results = await this.getUserAssessment(tx, userId).then(
      generateRecord2(
        (r) => r.skillId,
        (r) => r.levelId,
      ),
    );

    return results;
  }

  async deleteUserLevels(tx: TransactionManager | null, userId: string): Promise<IUserLevel[]> {
    const results = await this.db.read(tx).where({ userId: userId }).del().cReturning();

    return results;
  }
}

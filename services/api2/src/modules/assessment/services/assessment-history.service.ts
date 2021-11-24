import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ISkillLevel } from '../../skill/types/skill-level.type';
import { IAssessmentHistory } from '../types/assessment-history.type';

@Injectable()
export class AssessmentHistoryService {
  constructor(
    @InjectKnexClient('AssessmentHistory')
    private db: KnexClient<'AssessmentHistory'>,
  ) {}

  async create(
    tx: TransactionManager,
    userId: string,
    assessmentId: string,
    levels: ISkillLevel[],
  ): Promise<IAssessmentHistory[]> {
    // update previous assessment isCurrent value to false
    await this.db
      .write(tx)
      .where({ userId: userId })
      .whereIn(
        'skillId',
        levels.map((l) => l.skillId),
      )
      .update({ isCurrent: false });

    // insert new entries
    const history = await this.db
      .write(tx)
      .insert(
        levels.map((l) => ({
          assessmentId,
          userId,
          skillId: l.skillId,
          levelId: l.id,
          isCurrent: true,
        })),
      )
      .cReturning();
    // get existing assessment result

    return history;
  }
  async deleteUserAssessmentsHistory(
    tx: TransactionManager,
    userId: string,
  ): Promise<IAssessmentHistory[]> {
    const results = await this.db.read(tx).where({ userId: userId }).del().cReturning();

    return results;
  }
}

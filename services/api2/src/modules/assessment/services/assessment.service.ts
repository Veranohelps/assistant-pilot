import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import {
  IAssessment,
  ICreateAssessmentDTO,
  ICreateAssessmentResult,
} from '../types/assessment.type';
import { AssessmentHistoryService } from './assessment-history.service';
import { UserLevelService } from './user-level.service';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectKnexClient('Assessment')
    private db: KnexClient<'Assessment'>,
    private userLevelService: UserLevelService,
    private assessmentHistoryService: AssessmentHistoryService,
  ) {}

  async create(
    tx: TransactionManager,
    createdBy: string,
    payload: ICreateAssessmentDTO,
  ): Promise<ICreateAssessmentResult> {
    const [assessment] = await this.db.write(tx).insert({ userId: createdBy }).cReturning();

    const userLevels = await this.userLevelService.create(
      tx,
      createdBy,
      assessment.id,
      payload.levels,
    );

    return { assessment, userLevels };
  }
  async deleteUserAssessments(tx: TransactionManager, userId: string): Promise<IAssessment[]> {
    await this.assessmentHistoryService.deleteUserAssessmentsHistory(tx, userId);
    await this.userLevelService.deleteUserLevels(tx, userId);

    const results = await this.db.read(tx).where({ userId: userId }).del().cReturning();

    return results;
  }
}

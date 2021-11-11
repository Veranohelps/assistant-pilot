import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import {
  IAssessment,
  ICreateAssessmentDTO,
  ICreateAssessmentResult,
} from '../types/assessment.type';
import { UserLevelService } from './user-level.service';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectKnexClient('Assessment')
    private db: KnexClient<'Assessment'>,
    private userLevelService: UserLevelService,
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
  async deleteUserAssessments(
    tx: TransactionManager | null,
    userId: string,
  ): Promise<IAssessment[]> {
    const results = await this.db.read(tx).where({ userId: userId }).del().cReturning();

    return results;
  }
}

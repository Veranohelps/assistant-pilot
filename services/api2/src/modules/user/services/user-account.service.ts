import { Injectable } from '@nestjs/common';
import { AssessmentHistoryService } from '../../assessment/services/assessment-history.service';
import { AssessmentService } from '../../assessment/services/assessment.service';
import { UserLevelService } from '../../assessment/services/user-level.service';
import { AuthService } from '../../auth/services/auth.service';
import { GcpService } from '../../common/services/gcp.service';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { ExpeditionService } from '../../expedition/services/expedition.service';

@Injectable()
export class UserAccountService {
  constructor(
    private userLevelService: UserLevelService,
    private gcpService: GcpService,
    private expeditionService: ExpeditionService,
    private assessmentService: AssessmentService,
    private assessmentHistoryService: AssessmentHistoryService,
    private authService: AuthService,
  ) {}

  async deleteAccount(
    tx: TransactionManager,
    id: string,
    avatarUrl: string | null,
    auth0Id: string,
  ) {
    const expeditionsDeleted = await this.expeditionService.deleteUserExpeditions(tx, id);
    console.info(`${expeditionsDeleted.length} user expeditions deleted`);

    const assessmentHistoryDeleted =
      await this.assessmentHistoryService.deleteUserAssessmentsHistory(tx, id);
    console.info(`${assessmentHistoryDeleted.length} assessmentHistory deleted`);

    const userLevelsDeleted = await this.userLevelService.deleteUserLevels(tx, id);
    console.info(`${userLevelsDeleted.length} userLevel deleted`);

    const assessmentDeleted = await this.assessmentService.deleteUserAssessments(tx, id);
    console.info(`${assessmentDeleted.length} assessment deleted`);

    await this.authService.deleteUser(tx, id, auth0Id);
    await this.gcpService.deleteAvatar(avatarUrl);
    console.info(`${auth0Id} - Auth0 deletion complete`);
  }
}

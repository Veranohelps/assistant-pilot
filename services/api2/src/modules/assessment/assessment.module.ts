import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SkillModule } from '../skill/skill.module';
import { PersonalAssessmentController } from './controllers/personal/personal.assessment.controller';
import { AssessmentEventHandler } from './events/event-handlers/assessment.event-handler';
import { AssessmentHistoryService } from './services/assessment-history.service';
import { AssessmentService } from './services/assessment.service';
import { UserLevelService } from './services/user-level.service';

@Module({
  imports: [
    DatabaseModule.forFeature(['Assessment', 'UserLevel', 'AssessmentHistory']),
    SkillModule,
  ],
  controllers: [PersonalAssessmentController],
  providers: [
    AssessmentService,
    UserLevelService,
    AssessmentHistoryService,

    // event handlers
    AssessmentEventHandler,
  ],
  exports: [UserLevelService, AssessmentService, AssessmentHistoryService],
})
export class AssessmentModule {}

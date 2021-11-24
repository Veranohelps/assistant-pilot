import { Module } from '@nestjs/common';
import { AssessmentModule } from '../assessment/assessment.module';
import { AuthService } from '../auth/services/auth.service';
import { DatabaseModule } from '../database/database.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { AdminUserController } from './controller/admin/admin.user.controller';
import { PersonalUserController } from './controller/personal/personal.user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [DatabaseModule.forFeature(['User']), AssessmentModule, ExpeditionModule],
  controllers: [PersonalUserController, AdminUserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}

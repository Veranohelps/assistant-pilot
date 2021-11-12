import { Module } from '@nestjs/common';
import { AssessmentModule } from '../assessment/assessment.module';
import { AuthService } from '../auth/services/auth.service';
import { DatabaseModule } from '../database/database.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { AdminUserController } from './controller/admin/admin.user.controller';
import { PersonalUserController } from './controller/personal/personal.user.controller';
import { UserAccountService } from './services/user-account.service';
import { UserService } from './services/user.service';

@Module({
  imports: [DatabaseModule.forFeature(['User']), AssessmentModule, ExpeditionModule],
  controllers: [PersonalUserController, AdminUserController],
  providers: [UserService, AuthService, UserAccountService],
  exports: [UserService],
})
export class UserModule {}

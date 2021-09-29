import { Module } from '@nestjs/common';
import { AssessmentModule } from '../assessment/assessment.module';
import { DatabaseModule } from '../database/database.module';
import { AdminUserController } from './controller/admin/admin.user.controller';
import { PersonalUserController } from './controller/personal/personal.user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [DatabaseModule.forFeature(['User']), AssessmentModule],
  controllers: [PersonalUserController, AdminUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

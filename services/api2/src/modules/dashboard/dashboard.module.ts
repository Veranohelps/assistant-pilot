import { Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition/expedition.module';
import { PersonalDashboardController } from './controllers/personal/personal.dashboard.controller';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [ExpeditionModule],
  controllers: [PersonalDashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

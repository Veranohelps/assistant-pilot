import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../../expedition/services/expedition.service';
import { EDashboardModuleID, TDashboardModules } from '../types/dashboard.type';
import { IDashboardExpeditionModule } from '../types/expedition-module.type';

@Injectable()
export class DashboardService {
  constructor(private expeditionService: ExpeditionService) {}

  async getUpcomingExpeditionModule(userId: string): Promise<IDashboardExpeditionModule> {
    const data = await this.expeditionService.getUpcomingExpeditions(userId);

    return { id: EDashboardModuleID.UPCOMING_EXPEDITION, data };
  }

  async getModules(userId: string): Promise<TDashboardModules[]> {
    const upcomingExpedition = await this.getUpcomingExpeditionModule(userId);

    return [upcomingExpedition];
  }
}

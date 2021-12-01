import { Injectable } from '@nestjs/common';
import withUrl, { appUrls } from '../../common/utilities/with-url';
import { ExpeditionUserService } from '../../expedition/services/expedition-user.service';
import { ExpeditionService } from '../../expedition/services/expedition.service';
import { EExpeditionInviteStatus } from '../../expedition/types/expedition-user.type';
import { IExpedition } from '../../expedition/types/expedition.type';
import { EDashboardModuleID, TDashboardModules } from '../types/dashboard.type';
import {
  IDashboardExpeditionModule,
  IDashboardPendingExpeditionInviteModule,
} from '../types/expedition-module.type';

@Injectable()
export class DashboardService {
  constructor(
    private expeditionService: ExpeditionService,
    private expeditionUserService: ExpeditionUserService,
  ) {}

  async getUpcomingExpeditionModule(userId: string): Promise<IDashboardExpeditionModule> {
    const data = await this.expeditionService.getUpcomingExpeditions(userId);

    withUrl(data, (e) => appUrls.personal.expedition.id(e.id));

    return { id: EDashboardModuleID.UPCOMING_EXPEDITION, data };
  }

  async getPendingInvites(userId: string): Promise<IDashboardPendingExpeditionInviteModule> {
    const data = await this.expeditionUserService
      .getUserInvites(userId, EExpeditionInviteStatus.PENDING)
      .then((res) => res.map((inv) => inv.expedition as IExpedition));

    withUrl(data, (e) => appUrls.personal.expedition.id(e.id));

    return { id: EDashboardModuleID.PENDING_EXPEDITION_INVITES, data };
  }

  async getModules(userId: string): Promise<TDashboardModules[]> {
    const [upcomingExpedition, pendingInvites] = await Promise.all([
      this.getUpcomingExpeditionModule(userId),
      this.getPendingInvites(userId),
    ]);

    return [upcomingExpedition, pendingInvites];
  }
}

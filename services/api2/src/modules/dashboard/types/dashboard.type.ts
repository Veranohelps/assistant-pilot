import {
  IDashboardExpeditionModule,
  IDashboardPendingExpeditionInviteModule,
} from './expedition-module.type';

export enum EDashboardModuleID {
  UPCOMING_EXPEDITION = 'upcomingExpedition',
  PENDING_EXPEDITION_INVITES = 'pendingExpeditionInvite',
}

export type TDashboardModules =
  | IDashboardExpeditionModule
  | IDashboardPendingExpeditionInviteModule;

export interface IGetDashboardResult {
  modules: TDashboardModules[];
}

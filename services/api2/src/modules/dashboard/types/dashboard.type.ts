import { IDashboardExpeditionModule } from './expedition-module.type';

export enum EDashboardModuleID {
  UPCOMING_EXPEDITION = 'upcomingExpedition',
}

export type TDashboardModules = IDashboardExpeditionModule;

export interface IGetDashboardResult {
  modules: TDashboardModules[];
}

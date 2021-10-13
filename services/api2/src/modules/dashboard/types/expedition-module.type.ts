import { TWithUrl } from '../../../types/helpers.type';
import { IExpedition } from '../../expedition/types/expedition.type';
import { EDashboardModuleID } from './dashboard.type';

export interface IDashboardExpeditionModule {
  id: EDashboardModuleID.UPCOMING_EXPEDITION;
  data: TWithUrl<IExpedition>[];
}

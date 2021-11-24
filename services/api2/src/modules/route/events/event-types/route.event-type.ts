import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { IRoute } from '../../types/route.type';

export enum ERouteEvents {
  DELETE_ROUTES = 'ROUTE.DELETE_ROUTES',
  UPDATE_ROUTES = 'ROUTE.UPDATE_ROUTES',
}

export interface IDeleteRoutesEvent {
  tx: TransactionManager;
  routes: IRoute[];
  userId: string | null;
}

export interface IUpdateRoutesEvent {
  tx: TransactionManager;
  routes: IRoute[];
}

export interface IRouteEventMappings {
  [ERouteEvents.DELETE_ROUTES]: IDeleteRoutesEvent;
  [ERouteEvents.UPDATE_ROUTES]: IUpdateRoutesEvent;
}

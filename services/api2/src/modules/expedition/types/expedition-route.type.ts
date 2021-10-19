import { IDefaultMeta } from '../../database/types/database.type';
import { IRoute, IRouteFull, IRouteSlim } from '../../route/types/route.type';

export interface IExpeditionRoute {
  expeditionId: string;
  routeId: string;
  startDateTime: Date;
  durationInHours: number | null;
  meta: IDefaultMeta;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpeditionRouteFull extends IExpeditionRoute {
  route: IRouteFull;
}

export interface ICreateExpeditionRoute {
  expeditionId: string;
  routeId: string;
  startDateTime: Date;
  durationInHours?: number;
  meta?: IDefaultMeta;
}

export interface ICreateExpeditionRoutesDTO {
  routes: {
    routeId: string;
    startDateTime: Date;
    durationInHours?: number;
  }[];
}

export interface IExpeditionRouteWithRouteSlim extends IExpeditionRoute {
  route: IRouteSlim;
}

export interface IExpeditionRouteWithRoute extends IExpeditionRoute {
  route: IRoute;
}

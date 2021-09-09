import { IDefaultMeta } from '../../database/types/database.type';

export interface IExpeditionRoute {
  expeditionId: string;
  routeId: string;
  meta: IDefaultMeta;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateExpeditionRoute {
  expeditionId: string;
  routeId: string;
  meta?: IDefaultMeta;
}

export interface IExpeditionRouteFull extends IExpeditionRoute {
  routes: { id: string; url: string }[];
}

import { Knex } from 'knex';
import { IPointGeometry } from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';
import { IActivityType } from '../../route/types/activity-type.type';
import { IRoute, IRouteSlim } from '../../route/types/route.type';
import { ICreateExpeditionRoutesDTO } from './expedition-route.type';

export interface IExpedition {
  id: string;
  userId: string | null;
  name: string;
  description: string | null;
  activityTypeIds: string[];
  coordinate: IPointGeometry;
  startDateTime: Date;
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateExpedition {
  activityTypeIds: string[];
  name: string;
  userId?: string;
  description?: string | null;
  startDateTime: Date;
  coordinate: Knex.Raw;
  meta?: IDefaultMeta;
}

export interface ICreateExpeditionDTO {
  activityTypes: string[];
  name: string;
  description?: string | null;
  routes: ICreateExpeditionRoutesDTO['routes'];
}

export interface IExpeditionFull extends IExpedition {
  routes?: IRoute[] | IRouteSlim[];
  activityTypes: IActivityType[];
}

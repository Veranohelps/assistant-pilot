import { Knex } from 'knex';
import { IPointGeometry } from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';
import { IActivityType } from '../../route/types/activity-type.type';
import { IRoute, IRouteSlim } from '../../route/types/route.type';
import { ICreateExpeditionRoutesDTO } from './expedition-route.type';
import { IExpeditionUser } from './expedition-user.type';

export interface IExpedition {
  id: string;
  userId: string | null;
  name: string;
  description: string | null;
  activityTypeIds: string[];
  routeIds: string[];
  coordinate: IPointGeometry;
  startDateTime: Date;
  estimatedDurationInMinutes: number;
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateExpedition {
  activityTypeIds: string[];
  routeIds: string[];
  name: string;
  userId?: string | null;
  description?: string | null;
  startDateTime: Date;
  coordinate: Knex.Raw;
  estimatedDurationInMinutes: number;
  meta?: IDefaultMeta;
}

export interface ICreateExpeditionDTO {
  activityTypes: string[];
  name: string;
  description?: string | null;
  routes: ICreateExpeditionRoutesDTO['routes'];
  invites: string[];
}

export interface IExpeditionFull extends IExpedition {
  routes?: IRoute[] | IRouteSlim[];
  activityTypes: IActivityType[];
  users?: IExpeditionUser[];
}
export interface IUpdateExpeditionDTO {
  activityTypes?: string[];
  name?: string;
  description?: string | null;
  routes?: ICreateExpeditionRoutesDTO['routes'];
  invites?: string[];
  users?: string[];
}

export enum EExpeditionStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN-PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

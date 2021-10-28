import { Knex } from 'knex';
import { ILineStringGeometry, IPolygonGeometry } from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';
import { IWaypoint } from '../../waypoint/types/waypoint.type';
import { IActivityType } from './activity-type.type';
import { ERouteOrigins } from './route-origin.type';

export interface IRoute {
  id: string;
  originId: ERouteOrigins;
  globalId?: string;
  activityTypeIds: string[];
  userId: string | null;
  name: string;
  description: string | null;
  coordinate?: ILineStringGeometry;
  boundingBox?: IPolygonGeometry;
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateRoute {
  name: string;
  description?: string;
  originId: ERouteOrigins;
  activityTypeIds: string[];
  globalId?: string;
  userId?: string;
  coordinate: Knex.Raw;
  boundingBox: Knex.Raw;
  meta?: IDefaultMeta;
}

export interface IRouteFindOptions {
  coordinate?: boolean;
}

export interface ICreateRouteDTO {
  name: string;
  description?: string;
  activityTypes: string[];
}

export interface IRouteSlim extends Omit<IRoute, 'coordinate'> {}

export interface IRouteFull extends IRoute {
  waypoints?: IWaypoint[];
  activityTypes?: IActivityType[];
}

export interface IGetUserRoutesUrlParameters {
  owner: string[];
}

export interface ICreateRouteResult {
  route: IRoute;
  waypoints: IWaypoint[];
}

export interface IRouteWithWaypoints extends IRoute {
  waypoints: IWaypoint[];
}

export interface IGetRouteUrlParameters {
  searchWaypointsBy: 'track' | 'boundingBox';
}

// export interface IGetRouteWithWaypointsOptions extends IGetRouteWaypointOptions {}

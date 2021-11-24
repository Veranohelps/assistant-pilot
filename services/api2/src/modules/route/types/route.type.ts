import { Knex } from 'knex';
import {
  ILineStringGeometry,
  IMultiPointGeometry,
  IPolygonGeometry,
} from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';
import { IWaypoint } from '../../waypoint/types/waypoint.type';
import { IActivityType } from './activity-type.type';
import { ERouteOrigins } from './route-origin.type';

export type TMPIRoutePartial = {
  coordinate: [number, number, number | null];
  distanceInMeters: number;
  highestPointInMeters: number;
  lowestPointInMeters: number;
  elevationGainInMeters: number;
  elevationLossInMeters: number;
};

export interface IRoute {
  id: string;
  originId: ERouteOrigins;
  globalId?: string;
  activityTypeIds: string[];
  levelIds: string[];
  userId: string | null;
  name: string;
  description: string | null;
  coordinate?: ILineStringGeometry;
  boundingBox?: IPolygonGeometry;
  highestPointInMeters: number;
  lowestPointInMeters: number;
  elevationGainInMeters: number;
  elevationLossInMeters: number;
  meteoPointsOfInterests: IMultiPointGeometry;
  meteoPointsOfInterestsRoutePartials: TMPIRoutePartial[];
  distanceInMeters: number;
  expeditionCount: number;
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
export interface IRouteWithTimezone extends IRoute {
  timezone: ITimeZone;
}

export interface ICreateRoute {
  name: string;
  description?: string | null;
  originId: ERouteOrigins;
  activityTypeIds: string[];
  levelIds?: string[];
  globalId?: string;
  userId?: string | null;
  coordinate: Knex.Raw;
  boundingBox: Knex.Raw;
  highestPointInMeters: number;
  lowestPointInMeters: number;
  elevationGainInMeters: number;
  elevationLossInMeters: number;
  meteoPointsOfInterests: Knex.Raw;
  distanceInMeters: Knex.Raw | number;
  meteoPointsOfInterestsRoutePartials: TMPIRoutePartial[];
  meta?: IDefaultMeta;
}

export interface IRouteFindOptions {
  coordinate?: boolean;
}

export interface ICreateRouteDTO {
  name: string;
  description?: string;
  activityTypes: string[];
  levels?: string[];
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

export interface ITimeZone {
  dstOffset?: number;
  rawOffset?: number;
  timeZoneId?: string;
  timeZoneName?: string;
}

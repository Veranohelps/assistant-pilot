import { Knex } from 'knex';
import { IPointGeometry, IPolygonGeometry } from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';
import { ERouteOrigins } from '../../route/types/route-origin.type';

export interface IWaypoint {
  id: string;
  userId: string | null;
  originId: string;
  typeIds: string[];
  name: string;
  description: string | null;
  radiusInMeters: number;
  coordinate: IPointGeometry;
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateWaypoint {
  typeIds: string[];
  originId: string;
  userId?: string | null;
  name: string;
  description?: string;
  radiusInMeters: number;
  coordinate: Knex.Raw;
  meta?: IDefaultMeta;
}

export interface ICreateWaypointDTO {
  types: string[];
  name: string;
  description: string;
  radiusInMeters: number;
  longitude: number;
  latitude: number;
  altitude: number;
}

export interface IGetRouteWaypointOptions {
  searchWaypointsBy: 'track' | 'boundingBox';
}

export interface IFindWaypointByGeometryOptions {
  originId?: ERouteOrigins;
  userId?: string;
}

export interface IFindWaypointByBoundingBoxUrlParameters {
  boundingBox: IPolygonGeometry;
}

export interface IWaypointFindOneOptions {
  userId?: string;
  originId?: ERouteOrigins;
}

import { Knex } from 'knex';
import { IPointGeometry } from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';

export interface IWaypoint {
  id: string;
  userId: string | null;
  originId: string;
  type: string;
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
  type: string;
  originId: string;
  name: string;
  description?: string;
  radiusInMeters: number;
  coordinate: Knex.Raw;
  meta?: IDefaultMeta;
}

export interface ICreateWaypointDTO {
  type: string;
  name: string;
  description?: string;
  radiusInMeters: number;
  longitude: number;
  latitude: number;
  altitude?: number | null;
}

export interface IGetRouteWaypointOptions {
  searchWaypointsBy: 'track' | 'boundingBox';
}

import { Knex } from 'knex';
import { IPointGeometry } from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';
import { IWaypoint } from '../../waypoint/types/waypoint.type';

export interface IExpedition {
  id: string;
  name: string;
  description: string | null;
  coordinate: IPointGeometry;
  startDateTime: Date;
  endDateTime: Date;
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateExpeditionDTO {
  name: string;
  description?: string | null;
  longitude: number;
  latitude: number;
  altitude?: number | null;
  startDateTime: Date;
  endDateTime: Date;
}

export interface ICreateExpedition {
  name: string;
  description?: string | null;
  startDateTime: Date;
  endDateTime: Date;
  coordinate: Knex.Raw;
  meta?: IDefaultMeta;
}

export interface IExpeditionFull extends IExpedition {
  routes: { id: string; url: string }[];
  waypoints: IWaypoint[];
}

import { Knex } from 'knex';
import { IPolygonGeometry } from '../../common/types/geojson.type';

export interface IBpaZone {
  id: string;
  name: string;
  description: string | null;
  coordinate: IPolygonGeometry;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBpaZone {
  name: string;
  coordinate: Knex.Raw;
  description?: string | null;
}

export interface ICreateBpaZoneDTO {
  name: string;
  description?: string | null;
}

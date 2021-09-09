import { Knex } from 'knex';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';

export interface IRoute {
  id: string;
  name: string;
  coordinate: ILineStringGeometry;
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateRoute {
  name: string;
  coordinate: Knex.Raw;
  meta?: IDefaultMeta;
}

export interface IRouteFindOptions {
  coordinate?: boolean;
}

import { Knex } from 'knex';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';

export interface IRoute {
  id: string;
  originId: string;
  globalId?: string;
  userId: string | null;
  name: string;
  coordinate: ILineStringGeometry;
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateRoute {
  name: string;
  originId: string;
  globalId?: string;
  userId?: string;
  coordinate: Knex.Raw;
  meta?: IDefaultMeta;
}

export interface IRouteFindOptions {
  coordinate?: boolean;
}

export interface IRouteSlim {
  id: string;
  originId: string;
  userId: string | null;
  name: string;
  url: string;
}

export interface IGetRoutesUrlParameters {
  owner: string[];
}

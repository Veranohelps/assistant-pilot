import { IEntity } from './entity.type';
import { IDatabaseTables } from './tables.type';

export interface IDefaultMeta {
  [k: string]: unknown;
}

export interface IDBTimestamps {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type TEntityRecord = Record<keyof IDatabaseTables, IEntity<any>>;

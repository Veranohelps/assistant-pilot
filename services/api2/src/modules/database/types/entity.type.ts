import { Knex } from 'knex';
import { IDatabaseTables } from './tables.type';

type defaultFunction<T> = (row: Partial<T>, builder: Knex.QueryBuilder) => any;

export enum EEntityNames {
  ROUTE = 'route',
  WAYPOINT = 'waypoint',
  EXPEDITION = 'expedition',
  EXPEDITION_WAYPOINT = 'expeditionWaypoint',
  EXPEDITION_ROUTE = 'expeditionRoute',
}

export interface IEntityColumn<T> {
  type: 'string' | 'number' | 'boolean' | 'array' | 'json' | 'date' | 'geometry';
  name?: string;
  select?: boolean;
  defaults?: {
    insert?: defaultFunction<T>;
    update?: defaultFunction<T>;
    select?: defaultFunction<T>;
  };
  returning?: any;
  hooks?: {
    beforeSelect?: (builder: Knex.QueryBuilder, knex: Knex) => void;
  };
}

export interface IVirtualEntityColumn<T> extends IEntityColumn<T> {
  virtual: true;
  create: (row: T, builder: Knex.QueryBuilder) => any;
}

export interface IRelationEntityColumn {
  alias?: string;
  policy: (builder: Knex.QueryBuilder) => void;
  entity: keyof IDatabaseTables;
  type: '1:M' | 'M:1' | 'M:M' | '1:1';
}

export interface IEntity<T = any> {
  columns: Record<keyof T, IEntityColumn<T> | IVirtualEntityColumn<T>>;
  relations?: Record<string, IRelationEntityColumn>;
  hooks?: {
    beforeSelect?: (builder: Knex.QueryBuilder, knex: Knex) => void;
  };
}

import { Knex, knex } from 'knex';
import { cloneDeep, get, merge, set } from 'lodash';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { entityMap } from '../database.entity';
import { TEntityRecord } from '../types/database.type';
import { IEntityColumn } from '../types/entity.type';
import { IDatabaseTables } from '../types/tables.type';
import { attachKnexListeners } from './helpers.knex';
import { knexClient } from './init-knex';

type TGetTableType<T extends keyof IDatabaseTables> =
  IDatabaseTables[T] extends Knex.CompositeTableType<infer U, any, any> ? U : never;
export interface IWithColumnsOptions<T extends keyof IDatabaseTables> {
  namespace?: string;
  with?: (keyof IDatabaseTables)[];
  paranoid?: boolean;
  selectAll?: boolean;
  overrides?: { [k in keyof TGetTableType<T>]?: Partial<IEntityColumn<TGetTableType<T>>> };
}

function withColumns<T extends keyof IDatabaseTables>(
  this: Knex.QueryBuilder,
  tableName: T,
  options?: IWithColumnsOptions<T>,
) {
  const clonedEntityMap = cloneDeep(entityMap);
  const queryCtx = this.queryContext() ?? {};

  queryCtx['entityMap'] = clonedEntityMap;
  this.queryContext(queryCtx);

  const { columns, relations = {} } = clonedEntityMap[tableName];

  if (options?.overrides) {
    merge(columns, options.overrides);
  }

  const ns = options?.namespace ? `${options.namespace}.` : '';
  const context = this.queryContext() ?? {};

  this.queryContext({ ...context, columns });

  Object.keys(columns).forEach((col) => {
    const entityColumn = columns[col];

    if (!options?.selectAll && entityColumn.select === false) return;

    const colName = `${tableName}.${entityColumn.name ?? col}`;
    let select: any = colName;

    if (entityColumn.type === 'geometry') {
      select = knexClient.raw('ST_AsGeoJSON(??)::json', [colName]);
    }

    this.select({
      [`${ns}${col}`]: select,
    });
  });

  // if (columns['deletedAt']) {
  //   this.andWhere('deletedAt', null);
  // }

  Object.keys(relations).forEach((rel) => {
    const entityColumn = relations[rel];

    if (options?.with?.includes(entityColumn.entity)) {
      entityColumn.policy(this);
      this.withColumns(entityColumn.entity, {
        namespace: entityColumn.alias ?? rel,
      });
    }
  });

  return this;
}

function sDel(this: Knex.QueryBuilder) {
  this.update({ deletedAt: new Date() });

  return this;
}

function paranoid(this: Knex.QueryBuilder, isParanoid = true) {
  const columns = this.queryContext().columns;

  if (!isParanoid && columns['deletedAt']) {
    this.orWhereNot('deletedAt', null);
  }

  return this;
}

function withQb(this: Knex.QueryBuilder) {
  return this.clone().modify(attachKnexListeners);
}

function whereIn2(this: Knex.QueryBuilder, column: string, items: any[]) {
  if (items.length < 80) return this.whereIn(column, items);

  return this.whereRaw(`"${column}" IN (VALUES${items.map(() => '(?)').join(',')})`, items);
}

function withTx(this: Knex.QueryBuilder, tx?: TransactionManager) {
  if (tx) {
    this.transacting(tx.ktx).on('query-error', tx.rollback.bind(tx));
  }

  return this;
}

function setContextValue(this: Knex.QueryBuilder, key: string, value: any) {
  if (/^(entityMap|columns).?/.test(key)) {
    throw new Error('entityMap and columns keys are reserved');
  }

  const ctx = this.queryContext() ?? {};

  set(ctx, key, value);
  this.queryContext(ctx);

  return this;
}

function getContextValue(this: Knex.QueryBuilder, key: string) {
  const ctx = this.queryContext() ?? {};

  get(ctx, key, null);
  this.queryContext(ctx);

  return this;
}

function cReturning(this: Knex.QueryBuilder) {
  const entityMap = this.queryContext().entityMap as TEntityRecord;
  const { columns } = entityMap[(this as any)._single.table as keyof IDatabaseTables];

  const cols: string[] = [];

  Object.keys(columns).forEach((key) => {
    cols.push(columns[key].returning ?? key);
  });

  this.returning(cols);

  return this;
}

let extended = false;

export function extendKnex() {
  if (extended) return;

  knex.QueryBuilder.extend('withColumns', withColumns);
  knex.QueryBuilder.extend('qb', withQb);
  knex.QueryBuilder.extend('tx', withTx);
  knex.QueryBuilder.extend('sDel', sDel);
  knex.QueryBuilder.extend('paranoid', paranoid);
  knex.QueryBuilder.extend('whereIn2', whereIn2);
  knex.QueryBuilder.extend('setContextValue', setContextValue);
  knex.QueryBuilder.extend('getContextValue', getContextValue);
  knex.QueryBuilder.extend('cReturning', cReturning);

  extended = true;
}

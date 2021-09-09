import { Knex, knex } from 'knex';
import { cloneDeep, merge } from 'lodash';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { entityMap } from '../database.entity';
import { IEntityColumn } from '../types/entity.type';
import { IDatabaseTables } from '../types/tables.type';
import { attachKnexListeners } from './helpers.knex';

type TGetTableType<T extends keyof IDatabaseTables> =
  IDatabaseTables[T] extends Knex.CompositeTableType<infer U, any, any> ? U : never;
export interface IWithColumnsOptions<T extends keyof IDatabaseTables> {
  namespace?: string;
  with?: (keyof IDatabaseTables)[];
  paranoid?: boolean;
  overrides?: { [k in keyof TGetTableType<T>]?: Partial<IEntityColumn<TGetTableType<T>>> };
}

function withColumns<T extends keyof IDatabaseTables>(
  this: Knex.QueryBuilder,
  tableName: T,
  options?: IWithColumnsOptions<T>,
) {
  const { columns, relations = {} } = cloneDeep(entityMap[tableName]);

  if (options?.overrides) {
    merge(columns, options.overrides);
  }

  const ns = options?.namespace ? `${options.namespace}.` : '';
  const context = this.queryContext() ?? {};

  this.queryContext({ ...context, columns });

  Object.keys(columns).forEach((col) => {
    const entityColumn = columns[col];

    if (entityColumn.select === false) return;

    this.select({
      [`${ns}${col}`]: `${tableName}.${entityColumn.name ?? col}`,
    });
  });

  if (columns['deletedAt']) {
    this.andWhere('deletedAt', null);
  }

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

export function extendKnex() {
  knex.QueryBuilder.extend('withColumns', withColumns);
  knex.QueryBuilder.extend('qb', withQb);
  knex.QueryBuilder.extend('tx', withTx);
  knex.QueryBuilder.extend('sDel', sDel);
  knex.QueryBuilder.extend('paranoid', paranoid);
  knex.QueryBuilder.extend('whereIn2', whereIn2);
}

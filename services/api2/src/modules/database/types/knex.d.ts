import { KnexPostgis } from 'knex-postgis';
import { TransactionManager } from '../common/utilities/transaction-manager';
import { IWithColumnsOptions } from '../modules/database/database.service';
import { IDatabaseTables } from './tables.type';

declare module 'knex' {
  interface Knex<TRecord extends {} = any, TResult = unknown[]> {
    postgis: KnexPostgis;
  }
  namespace Knex {
    // eslint-disable-next-line @typescript-eslint/ban-types
    interface QueryBuilder<TRecord extends {} = any, TResult = any> {
      withColumns(
        tableName: keyof IDatabaseTables,
        options?: IWithColumnsOptions,
      ): QueryBuilder<TRecord, TResult>;

      tx(tx?: TransactionManager | null): QueryBuilder<TRecord, TResult>;

      qb(): QueryBuilder<TRecord, TResult>;

      sDel(): QueryBuilder<TRecord, TResult>;

      paranoid(isParanoid?: boolean): QueryBuilder<TRecord, TResult>;

      whereIn2: WhereIn<TRecord, TResult>;

      postgis(): KnexPostgis;
    }
  }
}

declare module 'knex/types/tables' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Tables extends IDatabaseTables {}
}

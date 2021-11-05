import 'knex';
import { KnexPostgis } from 'knex-postgis';
import { TransactionManager } from '../modules/common/utilities/transaction-manager';
import { IWithColumnsOptions } from '../modules/database/knex/extensions.knex';
import { IEntityColumn } from '../modules/database/types/entity.type';
import { IDatabaseTables } from '../modules/database/types/tables.type';

declare module 'knex' {
  interface Knex {
    postgis: KnexPostgis;
  }

  namespace DeferredKeySelection {}
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

      getContextValue(key: string): unknown;

      setContextValue(key: string, value: any): QueryBuilder<TRecord, TResult>;

      sTest<T extends keyof ResolveTableType<TRecord>>(col: T, override: IEntityColumn<TRecord>);

      cReturning(): QueryBuilder<TRecord, TRecord[]>;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
  }
}

declare module 'knex/types/tables' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Tables extends IDatabaseTables {}
}

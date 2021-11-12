/* eslint-disable @typescript-eslint/ban-types */
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

  // this is copied from knex because it wasn't exported
  // and is quite important for maintaining type safety
  // while extending knex
  type DeferredKeySelection<
    TBase,
    TKeys extends string,
    THasSelect extends true | false = false,
    TAliasMapping extends {} = {},
    TSingle extends boolean = false,
    TIntersectProps extends {} = {},
    TUnionProps = never,
  > = {
    _base: TBase;
    _hasSelection: THasSelect;
    _keys: TKeys;
    _aliases: TAliasMapping;
    _single: TSingle;
    _intersectProps: TIntersectProps;
    _unionProps: TUnionProps;
  };
  namespace Knex {
    interface QueryBuilder<TRecord extends {} = any, TResult = any> {
      // withColumns(
      //   tableName: keyof IDatabaseTables,
      //   options?: IWithColumnsOptions,
      // ): QueryBuilder<TRecord, TResult>;

      withColumns<TTable extends Knex.TableNames>(
        tableName: TTable,
        options?: IWithColumnsOptions<TTable>,
      ): Knex.QueryBuilder<
        Knex.TableType<TTable>,
        DeferredKeySelection<Knex.ResolveTableType<Knex.TableType<TTable>>, never>[]
      >;

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

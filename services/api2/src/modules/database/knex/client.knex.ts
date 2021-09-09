import { OnModuleDestroy } from '@nestjs/common';
import knex, { Knex } from 'knex';
import knexPostgis from 'knex-postgis';
import knexConfig from '../../../../knexfile';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { IDatabaseTables } from '../types/tables.type';
import { extendKnex, IWithColumnsOptions } from './extensions.knex';
import { attachKnexListeners } from './helpers.knex';

extendKnex();

export const knexClient = knex(
  knexConfig[process.env.NODE_ENV as 'test' | 'local' | 'development' | 'production'],
);

knexPostgis(knexClient);

export class KnexClient<T extends keyof IDatabaseTables> implements OnModuleDestroy {
  knex: Knex;
  entity: T;

  constructor(entity: T) {
    this.entity = entity;
    this.knex = knexClient;
  }

  write(tx: TransactionManager, options?: IWithColumnsOptions<T>) {
    const builder = this.knex(this.entity).withColumns(this.entity, options).tx(tx);

    builder.modify(attachKnexListeners);

    return builder;
  }

  read(tx?: TransactionManager | null, options?: IWithColumnsOptions<T>) {
    const builder = this.knex(this.entity).withColumns(this.entity, options).tx(tx);

    builder.modify(attachKnexListeners);

    return builder;
  }

  get builder() {
    return this.knex(this.entity);
  }

  async onModuleDestroy() {
    await this.knex.destroy();
  }
}

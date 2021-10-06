import knex from 'knex';
import knexConfig from '../../../../knexfile';

export const knexClient = knex(
  knexConfig[process.env.NODE_ENV as 'test' | 'local' | 'development' | 'production'],
);

import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.dropUnique(['globalId'], DatabaseConstraints.ROUTE_GLOBAL_ID_UNIQUE);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.unique(['globalId'], { indexName: DatabaseConstraints.ROUTE_GLOBAL_ID_UNIQUE });
  });
}

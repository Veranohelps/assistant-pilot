import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Expedition', (table) => {
    table.dropUnique(['name'], DatabaseConstraints.EXPEDITION_NAME_UNIQUE);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Expedition', (table) => {
    table.unique(['name'], { indexName: DatabaseConstraints.EXPEDITION_NAME_UNIQUE });
  });
}

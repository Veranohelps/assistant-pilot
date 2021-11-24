import { Knex } from 'knex';
import { extendKnex } from '../knex/extensions.knex';

extendKnex();

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('User', (table) => {
    table.index(
      [knex.raw('lower(?? || ??)', ['firstName', 'lastName'])],
      'USER_FIRST_NAME_LAST_NAME_INDEX',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('User', (table) => {
    table.dropIndex(
      [knex.raw('lower(?? || ??)', ['firstName', 'lastName'])],
      'USER_FIRST_NAME_LAST_NAME_INDEX',
    );
  });
}

import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Expedition', (table) => {
    table
      .string('userId', 50)
      .nullable()
      .references('id')
      .inTable('User')
      .withKeyName(DatabaseConstraints.EXPEDITION_USER_ID_FKEY);
    table.dropColumns('endDateTime');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Expedition', (table) => {
    table.dropForeign(DatabaseConstraints.EXPEDITION_USER_ID_FKEY);
    table.dropColumns('userId');
    table.timestamp('endDateTime').nullable();
  });

  await knex('Expedition').update({
    endDateTime: knex.raw(`startDateTime + interval '1 day'`),
  } as any);

  await knex.schema.alterTable('Expedition', (table) => {
    table.timestamp('endDateTime').notNullable();
  });
}

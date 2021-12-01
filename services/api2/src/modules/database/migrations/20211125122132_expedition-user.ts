import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ExpeditionUser', (table) => {
    table
      .string('expeditionId', 50)
      .notNullable()
      .references('id')
      .inTable('Expedition')
      .withKeyName(DatabaseConstraints.EXPEDITION_USER_EXPEDITION_ID_FKEY);
    table
      .string('userId', 50)
      .notNullable()
      .references('id')
      .inTable('User')
      .withKeyName(DatabaseConstraints.EXPEDITION_USER_USER_ID_FKEY);
    table.boolean('isOwner').notNullable().defaultTo(false);
    table.string('inviteStatus', 25).notNullable();
    table.timestamp('acceptedOn').nullable();
    table.timestamp('rejectedOn').nullable();
    table.timestamp('leftOn').nullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    table.unique(['expeditionId', 'userId'], {
      indexName: DatabaseConstraints.EXPEDITION_USER_PKEY,
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ExpeditionUser');
}

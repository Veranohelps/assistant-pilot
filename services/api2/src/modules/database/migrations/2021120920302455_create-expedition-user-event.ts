import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ExpeditionUserEvent', (table) => {
    table
      .string('id', 50)
      .primary({ constraintName: DatabaseConstraints.EXPEDITION_USER_EVENT_PKEY });
    table
      .string('expeditionId', 50)
      .notNullable()
      .references('id')
      .inTable('Expedition')
      .withKeyName(DatabaseConstraints.EXPEDITION_USER_EVENT_EXPEDITION_ID_FKEY);
    table
      .string('userId', 50)
      .notNullable()
      .references('id')
      .inTable('User')
      .withKeyName(DatabaseConstraints.EXPEDITION_USER_EVENT_USER_ID_FKEY);
    table
      .string('type', 50)
      .notNullable()
      .references('id')
      .inTable('ExpeditionUserEventType')
      .withKeyName(DatabaseConstraints.EXPEDITION_USER_EVENT_EXPEDITION_EVENT_TYPE_ID_FKEY);
    table.timestamp('dateTime').notNullable();
    table.specificType('coordinate', 'GEOGRAPHY(POINTZ)').nullable();
    table.jsonb('meta').notNullable().defaultTo('{}');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ExpeditionUserEvent');
}

import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Expedition', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.EXPEDITION_PKEY });
    table
      .string('name', 255)
      .notNullable()
      .unique({ indexName: DatabaseConstraints.EXPEDITION_NAME_UNIQUE });
    table.text('description').nullable();
    table.specificType('coordinate', 'GEOGRAPHY(POINTZ)').notNullable();
    table.timestamp('startDateTime').notNullable();
    table.timestamp('endDateTime').notNullable();
    table.jsonb('meta').notNullable().defaultTo('{}');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Expedition');
}

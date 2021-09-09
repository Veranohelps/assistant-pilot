import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Waypoint', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.WAYPOINT_PKEY });
    table.string('type', 50).notNullable();
    table.text('name').notNullable();
    table.text('description').nullable();
    table.float('radiusInMeters').notNullable();
    table.specificType('coordinate', 'GEOGRAPHY(POINTZ)').notNullable();
    table.jsonb('meta').notNullable().defaultTo('{}');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Waypoint');
}

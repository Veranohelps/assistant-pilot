import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('WaypointType', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.WAYPOINT_TYPE_PKEY });
    table.string('activityType', 50).notNullable();
    table.string('name', 255).notNullable();
    table.string('_3x3', 255).notNullable();
    table.text('description').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('WaypointType');
}

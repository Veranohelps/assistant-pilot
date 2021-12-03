import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('BpaZoneReport', (table) => {
    table
      .string('zoneId', 50)
      .notNullable()
      .references('id')
      .inTable('BpaZone')
      .withKeyName(DatabaseConstraints.BPA_ZONE_REPORT_ZONE_ID_FKEY);
    table
      .string('reportId', 50)
      .notNullable()
      .references('id')
      .inTable('BpaReport')
      .withKeyName(DatabaseConstraints.BPA_ZONE_REPORT_REPORT_ID_FKEY);
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());

    table.unique(['zoneId', 'reportId'], {
      indexName: DatabaseConstraints.BPA_ZONE_REPORT_PKEY,
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('BpaZoneReport');
}

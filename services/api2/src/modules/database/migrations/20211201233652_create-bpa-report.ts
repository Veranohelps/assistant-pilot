import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('BpaReport', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.BPA_REPORT_PKEY });
    table.specificType('zoneIds', 'text ARRAY').notNullable().defaultTo('{}');
    table
      .string('providerId', 50)
      .notNullable()
      .references('id')
      .inTable('BpaProvider')
      .withKeyName(DatabaseConstraints.BPA_REPORT_PROVIDER_ID_FKEY);
    table.timestamp('publishDate').notNullable();
    table.timestamp('validUntilDate').notNullable();
    table.text('resourceUrl').notNullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    table.index('zoneIds', 'BPA_REPORT_ZONE_IDS_INDEX', 'GIN');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('BpaReport');
}

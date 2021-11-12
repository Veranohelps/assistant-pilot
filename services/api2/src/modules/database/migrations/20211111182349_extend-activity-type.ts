import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ActivityType', (table) => {
    table.float('defaultPace').nullable();
    table.float('uphillPace').nullable();
    table.float('downhillPace').nullable();
    table.float('unknownPercentage').nullable();
  });

  await knex('ActivityType').where({ id: 'act-ntc-edm' }).update({
    defaultPace: 3000,
    uphillPace: 400,
    downhillPace: 1200,
    unknownPercentage: 0,
  });
  await knex('ActivityType').whereNot({ id: 'act-ntc-edm' }).update({
    defaultPace: 4000,
    uphillPace: 400,
    downhillPace: 600,
    unknownPercentage: 20,
  });

  await knex.schema.alterTable('ActivityType', (table) => {
    table.float('defaultPace').notNullable().alter();
    table.float('uphillPace').notNullable().alter();
    table.float('downhillPace').notNullable().alter();
    table.float('unknownPercentage').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ActivityType', (table) => {
    table.dropColumns('defaultPace', 'uphillPace', 'downhillPace', 'unknownPercentage');
  });
}

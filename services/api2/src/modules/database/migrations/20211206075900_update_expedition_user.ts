import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ExpeditionUser', (table) => {
    table.string('expeditionStatus', 50).nullable();
  });
  await knex.raw(`
  UPDATE "ExpeditionUser"
  SET "expeditionStatus" = 'FINISHED'
  FROM "Expedition"
  WHERE "expeditionId" = "Expedition".id
  AND "startDateTime" <= now() 
  `);
  await knex.raw(`
  UPDATE "ExpeditionUser"
  SET "expeditionStatus" = 'PLANNING'
  FROM "Expedition"
  WHERE "expeditionId" = "Expedition".id
  AND "startDateTime" > now() 
  `);

  await knex.schema.alterTable('ExpeditionUser', (table) => {
    table.string('expeditionStatus').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ExpeditionUser', (table) => {
    table.dropColumn('expeditionStatus');
  });
}

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ExpeditionRoute', (table) => {
    table.timestamp('startDateTime').nullable();
    table.float('durationInHours').nullable();
  });

  // update startDateTime for existing expeditionRoutes
  await knex.raw(`
  UPDATE "ExpeditionRoute"
  SET "startDateTime" = "Expedition"."startDateTime"
  FROM "Expedition"
  WHERE "expeditionId" = "Expedition".id
  `);

  await knex.schema.alterTable('ExpeditionRoute', (table) => {
    table.timestamp('startDateTime').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ExpeditionRoute', (table) => {
    table.dropColumns('startDateTime', 'durationInHours');
  });
}

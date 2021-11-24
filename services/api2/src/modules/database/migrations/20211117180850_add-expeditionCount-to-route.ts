import { Knex } from 'knex';
import { extendKnex } from '../knex/extensions.knex';

extendKnex();

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.integer('expeditionCount').notNullable().defaultTo(0);
  });

  await knex.raw(`
    UPDATE "Route" SET
      "expeditionCount" = er.count
    FROM
      (SELECT "routeId", count("routeId") as "count" FROM "ExpeditionRoute" GROUP BY "routeId") as er
    WHERE er."routeId" = "Route".id
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.dropColumn('expeditionCount');
  });
}

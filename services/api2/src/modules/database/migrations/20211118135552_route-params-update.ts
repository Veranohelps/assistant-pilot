import { Knex } from 'knex';
import { extendKnex } from '../knex/extensions.knex';

extendKnex();

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.jsonb('meteoPointsOfInterestsRoutePartials').notNullable().defaultTo('[]');
  });

  await knex.schema.alterTable('RouteActivityType', (table) => {
    table.jsonb('estimatedDurationToMeteoPointsOfInterestsInMinutes').notNullable().defaultTo('[]');
  });

  await knex.schema.alterTable('ExpeditionRoute', (table) => {
    table.float('estimatedDurationInMinutes').notNullable().defaultTo(0);
    table.jsonb('estimatedDurationToMeteoPointsOfInterestsInMinutes').notNullable().defaultTo('[]');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.dropColumn('meteoPointsOfInterestsRoutePartials');
  });

  await knex.schema.alterTable('RouteActivityType', (table) => {
    table.dropColumn('estimatedDurationToMeteoPointsOfInterestsInMinutes');
  });

  await knex.schema.alterTable('ExpeditionRoute', (table) => {
    table.dropColumns(
      'estimatedDurationInMinutes',
      'estimatedDurationToMeteoPointsOfInterestsInMinutes',
    );
  });
}

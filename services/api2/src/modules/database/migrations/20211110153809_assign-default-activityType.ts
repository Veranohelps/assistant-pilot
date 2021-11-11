import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('Route').update({ activityTypeIds: ['act-ntc-sdr'], levelIds: ['ntc-sdr-t1'] });
  await knex('Expedition').update({ activityTypeIds: ['act-ntc-sdr'] });
}

export async function down(knex: Knex): Promise<void> {
  await knex('Route').update({ activityTypeIds: [], levelIds: [] });
  await knex('Expedition').update({ activityTypeIds: [] });
}

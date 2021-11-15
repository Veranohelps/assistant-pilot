import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('ActivityType')
    .where({
      id: 'act-ntc-edm',
    })
    .update({
      unknownPercentage: 20,
    });
}

export async function down(): Promise<void> {
  return;
}

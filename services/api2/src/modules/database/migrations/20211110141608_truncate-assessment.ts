import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('UserLevel').del();
  await knex('AssessmentHistory').del();
  await knex('Assessment').del();
}

export async function down(): Promise<void> {
  return;
}

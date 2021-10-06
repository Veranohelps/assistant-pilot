import { Knex } from 'knex';
import { generateId } from '../../common/utilities/generate-id';
import { extendKnex } from '../knex/extensions.knex';

extendKnex();

export async function up(knex: Knex): Promise<void> {
  // set default globalIds
  const existingRoutes = await knex('Route');

  if (existingRoutes.length) {
    await knex('Route')
      .withColumns('Route')
      .insert(
        existingRoutes.map((r) => ({ ...r, originId: 'dersu', globalId: generateId() } as any)),
      )
      .onConflict('id')
      .merge(['originId', 'globalId'] as any);
  }

  await knex.schema.alterTable('Route', (table) => {
    table.string('globalId', 50).notNullable().alter();
    table.string('originId', 50).notNullable().alter();
  });
}

export async function down(): Promise<void> {
  return;
}

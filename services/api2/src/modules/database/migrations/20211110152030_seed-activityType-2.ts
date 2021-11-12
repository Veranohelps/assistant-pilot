import { Knex } from 'knex';

const types: any[] = [
  {
    id: 'act-ntc-sdr',
    name: 'Senderismo',
    skillId: 'ntc-sdr',
  },
  {
    id: 'act-ntc-msn',
    name: 'Montañismo (sin nieve)',
    skillId: 'ntc-msn',
  },
  {
    id: 'act-ntc-rdn',
    name: 'Raquetas de nieve',
    skillId: 'ntc-rdn',
  },
  {
    id: 'act-ntc-acn',
    name: 'Alpinismo (con nieve)',
    skillId: 'ntc-acn',
  },
  {
    id: 'act-ntc-edm',
    name: 'Esquí de montaña',
    skillId: 'ntc-edm',
  },
];

export async function up(knex: Knex): Promise<void> {
  // truncate existing data
  await knex('ActivityType').del();

  // seed
  await knex('ActivityType').insert(types);
}

export async function down(knex: Knex): Promise<void> {
  await knex('ActivityType')
    .whereIn(
      'id',
      types.map((o) => o.id as string),
    )
    .del();
}

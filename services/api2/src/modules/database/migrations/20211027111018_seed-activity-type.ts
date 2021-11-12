import { Knex } from 'knex';
import { generateId } from '../../common/utilities/generate-id';

const types: any[] = [
  {
    id: generateId(),
    name: 'Montañismo',
  },
  {
    id: generateId(),
    name: 'Senderismo',
  },
  {
    id: generateId(),
    name: 'Raquetas de nieve',
  },
  {
    id: generateId(),
    name: 'Esquí',
  },
  {
    id: generateId(),
    name: 'Esquí de travesía',
  },
  {
    id: generateId(),
    name: 'Barrancos',
  },
  {
    id: generateId(),
    name: 'Ferratas',
  },
  {
    id: generateId(),
    name: 'Otras',
  },
];

export async function up(knex: Knex): Promise<void> {
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

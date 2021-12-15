import { Knex } from 'knex';
import { generateId } from '../../common/utilities/generate-id';
import {
  EWaypointType3x3,
  EWaypointTypeActivityType,
  IWaypointType,
} from '../../waypoint/types/waypoint-type.type';

const types: IWaypointType[] = [
  {
    id: generateId(),
    name: 'Altitud',
    description: 'Cota a partir de la cual hay que tener en cuenta el mal de altura (3.500m)',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
];

export async function up(knex: Knex): Promise<void> {
  await knex('WaypointType').where({ name: 'exit' }).update({ name: 'Salida' });
  await knex('WaypointType').where({ name: 'arrival' }).update({ name: 'Llegada' });
  await knex('WaypointType').where({ name: 'checkpoint' }).update({ name: 'Punto de control' });
  await knex('WaypointType')
    .where({ name: 'no return point' })
    .update({ name: 'Punto de no retorno' });
  await knex('WaypointType').where({ name: 'transitions' }).update({ name: 'Transiciones' });
  await knex('WaypointType')
    .where({ name: 'ground traps' })
    .update({ name: 'Trampas del terreno' });
  await knex('WaypointType')
    .where({ name: 'change of terrain (ates)' })
    .update({ name: 'Cambio del terreno (ATES)' });
  await knex('WaypointType')
    .where({ name: 'inclination 25º-45º' })
    .update({ name: 'Inclinación 25º-45º' });
  await knex('WaypointType').where({ name: 'bpa' }).update({ name: 'Paso Técnico' });
  await knex('WaypointType').where({ name: 'home via' }).update({ name: 'Inicio vía' });
  await knex('WaypointType').where({ name: 'end via' }).update({ name: 'Fin vía' });
  await knex('WaypointType').where({ name: 'equipped step' }).update({ name: 'Paso equipado' });
  await knex('WaypointType').where({ name: 'climb/destrepe' }).update({ name: 'Trepe/destrepe' });
  await knex('WaypointType')
    .where({ name: 'orientation/detour' })
    .update({ name: 'Desvío orientación' });
  await knex('WaypointType')
    .where({ name: 'terrain (trail, sinsendero, rock, glacier, snowfield)' })
    .update({ name: 'Terreno (sendero, sin sendero, roca, glaciar, rampa de nieve)' });
  await knex('WaypointType')
    .where({ name: 'panoramic point' })
    .update({ name: 'Punto panorámico' });
  await knex('WaypointType').where({ name: 'leaks' }).update({ name: 'Escapes' });
  await knex('WaypointType').where({ name: 'weather' }).update({ name: 'Estación de esquí' });
  await knex('WaypointType').insert(types);
}

export async function down(): Promise<void> {
  return;
}

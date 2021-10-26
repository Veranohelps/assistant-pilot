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
    name: 'exit',
    description: 'moment before starting (from home to pk), confirmation of prior information',
    _3x3: EWaypointType3x3.LOCAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'arrival',
    description: 'final feedback',
    _3x3: EWaypointType3x3.FEEDBACK,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'checkpoint',
    description: 'these points that are not relevant, even if they serve as part-time references',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'no return point',
    description: 'from which the type of solutions or alternatives go through to finish the route',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'transitions',
    description: 'noticeable up and down changes, change of progression technique, rhythm',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.SNOW,
  },
  {
    id: generateId(),
    name: 'ground traps',
    description:
      'serious consequences of avalanche, large exposure, accumulation pits, falls by cuts',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.SNOW,
  },
  {
    id: generateId(),
    name: 'change of terrain (ates)',
    description: 'according to classification ates, simple, demanding and complex terrain',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.SNOW,
  },
  {
    id: generateId(),
    name: 'inclination 25º-45º',
    description: 'inclinations more likely to occur in an avalanche',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.SNOW,
  },
  {
    id: generateId(),
    name: 'bpa',
    description: 'layers highlighted in the prediction bulletin avalanches',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.SNOW,
  },
  {
    id: generateId(),
    name: 'home via',
    description: 'start of activity, technical part ascension, edge, corridor',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'end via',
    description: 'end of technical part, start of return',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'equipped step',
    description: 'chains, pegs, handrails, rappel, bridge, stairs',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'climb/destrepe',
    description: 'short climbing or climbing areas, no more than Liº',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'orientation/detour',
    description: 'detours or areas of application of guidance techniques',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'terrain (trail, sinsendero, rock, glacier, snowfield)',
    description: 'change of terrain and progression technique',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'panoramic point',
    description: 'ideal sites of views, panoramas, fauna, flora, geology',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'leaks',
    description: '',
    _3x3: EWaypointType3x3.ZONAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
  {
    id: generateId(),
    name: 'weather',
    description: 'very frequent weather changes, north-south orientation',
    _3x3: EWaypointType3x3.LOCAL,
    activityType: EWaypointTypeActivityType.ALL,
  },
];

export async function up(knex: Knex): Promise<void> {
  await knex('WaypointType').insert(types);
}

export async function down(knex: Knex): Promise<void> {
  await knex('WaypointType')
    .whereIn(
      'id',
      types.map((o) => o.id),
    )
    .del();
}

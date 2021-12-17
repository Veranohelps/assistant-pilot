import { Knex } from 'knex';
import {
  EExpeditionUserEventType,
  IExpeditionUserEventType,
} from '../../expedition/types/expedition-event.type';

const eventTypes: IExpeditionUserEventType[] = [
  {
    id: EExpeditionUserEventType.LOCATION,
    name: 'Location',
    description: 'Location events, receives coordinates',
  },
  {
    id: EExpeditionUserEventType.NETWORK,
    name: 'Network',
    description: 'Network events, meta is a json with {network: true/false}',
  },
  {
    id: EExpeditionUserEventType.PING,
    name: 'Ping',
    description: 'App ping, coordinates are optional',
  },
  {
    id: EExpeditionUserEventType.ERROR,
    name: 'Error',
    description:
      'Error events, informed that an error ocurrs, meta is a json with {message: error message}',
  },
  {
    id: EExpeditionUserEventType.START,
    name: 'Start',
    description: 'Start event, coordinates are optional',
  },
  {
    id: EExpeditionUserEventType.FINISH,
    name: 'Finish',
    description: 'Finish event, coordinates are optional',
  },
];

export async function up(knex: Knex): Promise<void> {
  await knex('ExpeditionUserEventType').insert(eventTypes);
}

export async function down(knex: Knex): Promise<void> {
  await knex('ExpeditionUserEventType')
    .whereIn(
      'id',
      eventTypes.map((o) => o.id),
    )
    .del();
}

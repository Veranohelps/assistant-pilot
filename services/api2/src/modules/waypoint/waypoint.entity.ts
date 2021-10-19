import { generateId } from '../common/utilities/generate-id';
import { IEntity } from '../database/types/entity.type';
import { IWaypoint } from './types/waypoint.type';

export const waypointEntity: IEntity<IWaypoint> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    userId: { type: 'string' },
    originId: { type: 'string' },
    type: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    radiusInMeters: { type: 'number' },
    coordinate: {
      type: 'string',
      hooks: {
        beforeSelect: (builder, knex) => {
          builder.select(knex.raw('ST_AsGeoJSON(??)::json as coordinate', ['Waypoint.coordinate']));
        },
      },
    },
    meta: { type: 'json', select: false },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date', select: false },
  },
};

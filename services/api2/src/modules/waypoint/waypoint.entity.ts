import { generateId } from '../common/utilities/generate-id';
import { knexClient } from '../database/knex/init-knex';
import { IEntity } from '../database/types/entity.type';
import { IWaypointType } from './types/waypoint-type.type';
import { IWaypoint } from './types/waypoint.type';

export const waypointEntity: IEntity<IWaypoint> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    gFingerprint: { type: 'string' },
    userId: { type: 'string' },
    originId: { type: 'string' },
    typeIds: { type: 'array' },
    name: { type: 'string' },
    description: { type: 'string' },
    radiusInMeters: { type: 'number' },
    coordinate: {
      type: 'string',
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', ['Waypoint.coordinate']),
      hooks: {
        beforeSelect: (builder) => {
          builder.select(
            knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', ['Waypoint.coordinate']),
          );
        },
      },
    },
    meta: { type: 'json', select: false },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date', select: false },
  },
};

export const waypointTypeEntity: IEntity<IWaypointType> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    activityType: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    _3x3: { type: 'string' },
  },
};

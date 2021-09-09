import { generateId } from '../common/utilities/generate-id';
import { IEntity } from '../database/types/entity.type';
import { IExpeditionRoute } from './types/expedition-route.type';
import { IExpeditionWaypoint } from './types/expedition-waypoint.type';
import { IExpedition } from './types/expedition.type';

export const expeditionEntity: IEntity<IExpedition> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    name: { type: 'string' },
    description: { type: 'string' },
    coordinate: { type: 'string' },
    startDateTime: { type: 'date' },
    endDateTime: { type: 'date' },
    meta: { type: 'json', select: false },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date', select: false },
  },
  hooks: {
    beforeSelect: (builder, knex) => {
      builder.select(knex.raw('ST_AsGeoJSON(coordinate)::json as coordinate'));
    },
  },
};

export const expeditionWaypointEntity: IEntity<IExpeditionWaypoint> = {
  columns: {
    expeditionId: { type: 'string' },
    waypointId: { type: 'string' },
    meta: { type: 'json' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
};

export const expeditionRouteEntity: IEntity<IExpeditionRoute> = {
  columns: {
    expeditionId: { type: 'string' },
    routeId: { type: 'string' },
    meta: { type: 'json' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
};

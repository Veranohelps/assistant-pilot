import { generateId } from '../common/utilities/generate-id';
import { IEntity } from '../database/types/entity.type';
import { IExpeditionRoute } from './types/expedition-route.type';
import { IExpedition } from './types/expedition.type';

export const expeditionEntity: IEntity<IExpedition> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    activityTypeIds: { type: 'array' },
    userId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    coordinate: { type: 'string' },
    startDateTime: { type: 'date' },
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

export const expeditionRouteEntity: IEntity<IExpeditionRoute> = {
  columns: {
    expeditionId: { type: 'string' },
    routeId: { type: 'string' },
    startDateTime: { type: 'date' },
    durationInHours: { type: 'number' },
    meta: { type: 'json' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
};

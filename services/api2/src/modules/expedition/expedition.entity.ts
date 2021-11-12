import { generateId } from '../common/utilities/generate-id';
import { IEntity } from '../database/types/entity.type';
import { IExpeditionRoute } from './types/expedition-route.type';
import { IExpedition } from './types/expedition.type';

export const expeditionEntity: IEntity<IExpedition> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    activityTypeIds: { type: 'array' },
    routeIds: { type: 'array' },
    userId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    coordinate: { type: 'geometry' },
    startDateTime: { type: 'date' },
    estimatedDurationInMinutes: { type: 'date' },
    meta: { type: 'json', select: false },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date', select: false },
  },
};

export const expeditionRouteEntity: IEntity<IExpeditionRoute> = {
  columns: {
    expeditionId: { type: 'string' },
    routeId: { type: 'string' },
    activityTypeIds: { type: 'array' },
    startDateTime: { type: 'date' },
    meta: { select: false, type: 'json' },
    createdAt: { select: false, type: 'date' },
    updatedAt: { select: false, type: 'date' },
  },
};

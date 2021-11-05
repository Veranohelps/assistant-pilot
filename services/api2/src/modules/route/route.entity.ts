import { generateId } from '../common/utilities/generate-id';
import { knexClient } from '../database/knex/init-knex';
import { IEntity } from '../database/types/entity.type';
import { IActivityType } from './types/activity-type.type';
import { IRouteOrigin } from './types/route-origin.type';
import { IRoute } from './types/route.type';

export const routeEntity: IEntity<IRoute> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    globalId: { type: 'string', select: false, defaults: { insert: () => generateId() } },
    originId: { type: 'string' },
    activityTypeIds: { type: 'array' },
    levelIds: { type: 'array' },
    userId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    coordinate: {
      type: 'string',
      select: false,
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', ['Route.coordinate']),
      hooks: {
        beforeSelect: (builder, knex) => {
          builder.select(knex.raw('ST_AsGeoJSON(??)::json as coordinate', ['Route.coordinate']));
        },
      },
    },
    boundingBox: {
      type: 'string',
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', ['Route.boundingBox']),
      hooks: {
        beforeSelect: (builder, knex) => {
          builder.select(
            knex.raw('ST_AsGeoJSON(??)::json as ??', ['Route.boundingBox', 'boundingBox']),
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

export const routeOriginEntity: IEntity<IRouteOrigin> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    name: { type: 'string' },
    description: { type: 'string' },
  },
};

export const activityTypeEntity: IEntity<IActivityType> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    skillId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
  },
};

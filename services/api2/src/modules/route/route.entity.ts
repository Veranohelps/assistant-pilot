import { generateId } from '../common/utilities/generate-id';
import { IEntity } from '../database/types/entity.type';
import { IRouteOrigin } from './types/route-origin.type';
import { IRoute } from './types/route.type';

export const routeEntity: IEntity<IRoute> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    globalId: { type: 'string', select: false, defaults: { insert: () => generateId() } },
    originId: { type: 'string' },
    userId: { type: 'string' },
    name: { type: 'string' },
    coordinate: {
      type: 'string',
      select: false,
      hooks: {
        beforeSelect: (builder, knex) => {
          builder.select(knex.raw('ST_AsGeoJSON(coordinate)::json as coordinate'));
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

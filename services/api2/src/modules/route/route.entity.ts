import { generateId } from '../common/utilities/generate-id';
import { IEntity } from '../database/types/entity.type';
import { IRoute } from './types/route.type';

export const routeEntity: IEntity<IRoute> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    name: { type: 'string' },
    coordinate: { type: 'string' },
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

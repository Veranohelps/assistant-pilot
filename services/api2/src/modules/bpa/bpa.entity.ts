import { generateId } from '../common/utilities/generate-id';
import { knexClient } from '../database/knex/init-knex';
import { IEntity } from '../database/types/entity.type';
import { IBpaProvider } from './types/bpa-provider.type';
import { IBpaReport } from './types/bpa-report.type';
import { IBpaZone } from './types/bpa-zone.type';

export const bpaZoneEntity: IEntity<IBpaZone> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    name: { type: 'string' },
    description: { type: 'string' },
    coordinate: {
      type: 'geometry',
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', ['Route.coordinate']),
    },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
};

export const bpaProviderEntity: IEntity<IBpaProvider> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    name: { type: 'string' },
    description: { type: 'string' },
    disabled: { type: 'boolean' },
  },
};

export const bpaREportEntity: IEntity<IBpaReport> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    zoneId: { type: 'string' },
    providerId: { type: 'string' },
    resourceUrl: { type: 'string' },
    publishDate: { type: 'date' },
    validUntilDate: { type: 'date' },
  },
};

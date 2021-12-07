import { generateId } from '../common/utilities/generate-id';
import { knexClient } from '../database/knex/init-knex';
import { IEntity } from '../database/types/entity.type';
import { IBpaProvider } from './types/bpa-provider.type';
import { IBpaReport } from './types/bpa-report.type';
import { IBpaZoneReport } from './types/bpa-zone-report.type';
import { IBpaZone } from './types/bpa-zone.type';

export const bpaZoneEntity: IEntity<IBpaZone> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    name: { type: 'string' },
    description: { type: 'string' },
    coordinate: {
      type: 'geometry',
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', ['BpaZone.coordinate']),
    },
    reportCount: { type: 'number' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
};

export const bpaProviderEntity: IEntity<IBpaProvider> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    name: { type: 'string' },
    url: { type: 'string' },
    logoUrl: { type: 'string' },
    description: { type: 'string' },
    reportCount: { type: 'number' },
    disabled: { type: 'boolean' },
  },
};

export const bpaReportEntity: IEntity<IBpaReport> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    providerId: { type: 'string' },
    zoneIds: { type: 'array' },
    resourceUrl: { type: 'string' },
    publishDate: { type: 'date' },
    validUntilDate: { type: 'date' },
  },
};

export const bpaZoneReportEntity: IEntity<IBpaZoneReport> = {
  columns: {
    zoneId: { type: 'string' },
    reportId: { type: 'string' },
    createdAt: { type: 'date' },
  },
};

import { generateId } from '../common/utilities/generate-id';
import { knexClient } from '../database/knex/init-knex';
import { IEntity } from '../database/types/entity.type';
import { IDataBaseExpeditionUserEvent } from './types/expedition-event.type';
import { IExpeditionUserRouteLog } from './types/expedition-log.type';
import { IExpeditionRoute } from './types/expedition-route.type';
import { IExpeditionUser } from './types/expedition-user.type';
import { IExpedition } from './types/expedition.type';

export const expeditionEntity: IEntity<IExpedition> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    activityTypeIds: { type: 'array' },
    routeIds: { type: 'array' },
    userId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    coordinate: {
      type: 'geometry',
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', ['Expedition.coordinate']),
    },
    startDateTime: { type: 'date' },
    estimatedDurationInMinutes: { type: 'number' },
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
    estimatedDurationInMinutes: { type: 'number' },
    estimatedDurationToMeteoPointsOfInterestsInMinutes: { type: 'json' },
    meta: { select: false, type: 'json' },
    createdAt: { select: false, type: 'date' },
    updatedAt: { select: false, type: 'date' },
  },
};

export const expeditionUserEntity: IEntity<IExpeditionUser> = {
  columns: {
    expeditionId: { type: 'string' },
    userId: { type: 'string' },
    isOwner: { type: 'boolean' },
    inviteStatus: { type: 'string' },
    acceptedOn: { type: 'date' },
    rejectedOn: { type: 'date' },
    leftOn: { type: 'date' },
    createdAt: { select: false, type: 'date' },
    updatedAt: { select: false, type: 'date' },
    expeditionStatus: { type: 'string' },
  },
};
export const expeditionUserEventEntity: IEntity<IDataBaseExpeditionUserEvent> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    expeditionId: { type: 'string' },
    userId: { type: 'string' },
    type: { type: 'string' },
    dateTime: { type: 'date' },
    coordinate: {
      type: 'string',
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', [
        'ExpeditionUserEvent.coordinate',
      ]),
      hooks: {
        beforeSelect: (builder) => {
          builder.select(
            knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', [
              'ExpeditionUserEvent.coordinate',
            ]),
          );
        },
      },
    },
    meta: { type: 'json' },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date', select: false },
  },
};
export const expeditionUserRouteLogEntity: IEntity<IExpeditionUserRouteLog> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    expeditionId: { type: 'string' },
    userId: { type: 'string' },
    routeIds: { type: 'array' },
    actualRouteId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    originId: { type: 'string' },
    visibility: { type: 'string' },
    averageSpeed: { type: 'number' },
    startDateTime: { type: 'date' },
    endDateTime: { type: 'date' },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date', select: false },
  },
};

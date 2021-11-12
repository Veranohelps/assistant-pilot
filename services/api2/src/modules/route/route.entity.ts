import { generateId } from '../common/utilities/generate-id';
import { knexClient } from '../database/knex/init-knex';
import { IEntity } from '../database/types/entity.type';
import { IActivityType } from './types/activity-type.type';
import { IRouteActivityType } from './types/route-activity-type.type';
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
      type: 'geometry',
      select: false,
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as coordinate', ['Route.coordinate']),
    },
    boundingBox: {
      type: 'geometry',
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as ??', [
        'Route.boundingBox',
        'boundingBox',
      ]),
    },
    distanceInMeters: { type: 'number' },
    elevationGainInMeters: { type: 'number' },
    elevationLossInMeters: { type: 'number' },
    highestPointInMeters: { type: 'number' },
    lowestPointInMeters: { type: 'number' },
    meteoPointsOfInterests: {
      type: 'geometry',
      returning: knexClient.raw('ST_AsGeoJSON(??)::json as ??', [
        'Route.meteoPointsOfInterests',
        'meteoPointsOfInterests',
      ]),
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
    defaultPace: { type: 'number' },
    uphillPace: { type: 'number' },
    downhillPace: { type: 'number' },
    unknownPercentage: { type: 'number' },
  },
};

export const routeActivityTypeEntity: IEntity<IRouteActivityType> = {
  columns: {
    routeId: { type: 'string' },
    activityTypeId: { type: 'string' },
    estimatedDurationInMinutes: { type: 'number' },
  },
};

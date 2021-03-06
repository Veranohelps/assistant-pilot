import Joi from 'joi';
import { ICreateRouteDTO, IGetRouteUrlParameters } from './types/route.type';

export const getUserRoutesQueryValidationSchema = Joi.object({
  owner: Joi.string().valid('me'),
});

export const getTimeZoneQueryValidationSchema = Joi.object({
  tz: Joi.string(),
});

export const createRouteValidationSchema = Joi.object<ICreateRouteDTO>({
  name: Joi.string().required(),
  description: Joi.string(),
  activityTypes: Joi.array().single().min(1).items(Joi.string()).required(),
  levels: Joi.array().single().items(Joi.string()),
});
export const createNoDersuRouteValidationSchema = Joi.object<ICreateRouteDTO>({
  name: Joi.string().required(),
  description: Joi.string(),
  activityTypes: Joi.array().single().items(Joi.string()),
  levels: Joi.array().single().items(Joi.string()),
});
export const updateRouteValidationSchema = Joi.object<ICreateRouteDTO>({
  name: Joi.string(),
  description: Joi.string(),
  activityTypes: Joi.array().single().min(1).items(Joi.string()).default([]),
  levels: Joi.array().single().items(Joi.string()).default([]),
});

export const getRouteValidationSchema = Joi.object<IGetRouteUrlParameters>({
  searchWaypointsBy: Joi.string().valid('track', 'boundingBox').default('track'),
});

export const searchRoutesVSchema = Joi.object({
  name: Joi.string().allow('').lowercase().trim(),
  levels: Joi.array(),
  activityTypes: Joi.array(),
  owner: Joi.array(),
});

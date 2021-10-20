import Joi from 'joi';
import { ICreateRouteDTO, IGetRouteUrlParameters } from './types/route.type';

export const getUserRoutesQueryValidationSchema = Joi.object({
  owner: Joi.array().min(1).items(Joi.string().valid('me')),
});

export const getDateQueryValidationSchema = Joi.object({
  dateTime: Joi.date().iso(),
});

export const createRouteValidationSchema = Joi.object<ICreateRouteDTO>({
  name: Joi.string().required(),
  description: Joi.string(),
});

export const updateRouteValidationSchema = Joi.object<ICreateRouteDTO>({
  name: Joi.string(),
  description: Joi.string(),
});

export const getRouteValidationSchema = Joi.object<IGetRouteUrlParameters>({
  searchWaypointsBy: Joi.string().valid('track', 'boundingBox').default('track'),
});

import Joi from 'joi';
import { ICreateRouteDTO } from './types/route.type';

export const getRoutesQueryValidationSchema = Joi.object({
  owner: Joi.array().min(1).items(Joi.string().valid('me')),
});

export const getDateQueryValidationSchema = Joi.object({
  dateTime: Joi.date().iso(),
});

export const createRouteValidationSchema = Joi.object<ICreateRouteDTO>({
  name: Joi.string().required(),
});

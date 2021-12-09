import { endOfDay, endOfToday, startOfDay, startOfToday } from 'date-fns';
import Joi from 'joi';

export const createBpaZoneVSchema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string(),
});

export const updateBpaZoneVSchema = Joi.object({
  name: Joi.string().max(255),
  description: Joi.string(),
});

export const createBpaProviderVSchema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().required(),
  url: Joi.string().uri().required(),
});

export const updateBpaProviderVSchema = Joi.object({
  name: Joi.string().max(255),
  description: Joi.string(),
  url: Joi.string().uri(),
});

export const createBpaReportVSchema = Joi.object({
  zoneIds: Joi.array().single().min(1).items(Joi.string()).required(),
  providerId: Joi.string().required(),
  publishDateTime: Joi.date()
    .max(endOfToday())
    .required()
    .custom((val) => startOfDay(val)),
  validUntilDateTime: Joi.date()
    .min(startOfToday())
    .greater(Joi.ref('publishDateTime'))
    .required()
    .custom((val) => endOfDay(val)),
});

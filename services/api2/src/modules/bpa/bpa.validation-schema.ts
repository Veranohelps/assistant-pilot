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
});

export const updateBpaProviderVSchema = Joi.object({
  name: Joi.string().max(255),
  description: Joi.string(),
});

export const createBpaReportVSchema = Joi.object({
  zoneIds: Joi.array().single().min(1).items(Joi.string()).required(),
  providerId: Joi.string().required(),
  publishDate: Joi.date()
    .max(endOfToday())
    .required()
    .custom((val) => startOfDay(val)),
  validUntilDate: Joi.date()
    .min(startOfToday())
    .greater(Joi.ref('publishDate'))
    .required()
    .custom((val) => endOfDay(val)),
});

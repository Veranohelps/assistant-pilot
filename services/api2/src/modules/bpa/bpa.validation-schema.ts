import Joi from 'joi';

export const createBpaZoneVSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});

export const createBpaProviderVSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

export const createBpaReportVSchema = Joi.object({
  zoneIds: Joi.array().min(1).items(Joi.string()).required(),
  providerId: Joi.string().required(),
  publishDate: Joi.date().max(new Date()).required(),
  validUntilDate: Joi.date().min(new Date()).greater(Joi.ref('publishDate')).required(),
});

import Joi from 'joi';

export const polygonGeometryValidationSchema = Joi.object({
  type: Joi.string().valid('Polygon').required(),
  coordinates: Joi.array()
    .min(1)
    .items(Joi.array().min(3).items(Joi.array().length(2).items(Joi.number())))
    .required(),
});

export const pointGeometryValidationSchema = Joi.object({
  type: Joi.string().valid('Point').required(),
  coordinates: Joi.array().min(3).items(Joi.number()).required(),
});

export const createWaypointValidationSchema = Joi.object({
  type: Joi.array().min(1).items(Joi.string()).required(),
  name: Joi.string().required(),
  description: Joi.string().default(null),
  radiusInMeters: Joi.number().default(100),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  altitude: Joi.number().required(),
});

export const updateWaypointValidationSchema = Joi.object({
  type: Joi.array().min(1).items(Joi.string()),
  name: Joi.string(),
  description: Joi.string(),
  radiusInMeters: Joi.number(),
  longitude: Joi.number(),
  latitude: Joi.number(),
  altitude: Joi.number(),
});

export const findWaypointByBoundingBoxValidationSchema = Joi.object({
  boundingBox: polygonGeometryValidationSchema.required(),
});

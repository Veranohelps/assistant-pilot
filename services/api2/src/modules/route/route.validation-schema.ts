import Joi from 'joi';

export const getRoutesQueryValidationSchema = Joi.object({
  owner: Joi.array().min(1).items(Joi.string().valid('me')),
});

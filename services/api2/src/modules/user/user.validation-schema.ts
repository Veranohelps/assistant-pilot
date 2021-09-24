import Joi from 'joi';

export const completeUserRegistrationValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  otherName: Joi.string(),
});

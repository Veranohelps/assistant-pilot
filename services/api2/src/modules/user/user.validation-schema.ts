import Joi from 'joi';

export const completeUserRegistrationValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  otherName: Joi.string(),
});
export const editedUserValidationSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
});

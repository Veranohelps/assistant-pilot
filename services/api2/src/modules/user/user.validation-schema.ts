import Joi from 'joi';

export const completeUserRegistrationValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export const editedUserValidationSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
});

export const searchUsersUrlParametersVSchema = Joi.object({
  name: Joi.string(),
});

import Joi from 'joi';
import { ICreateExpeditionDTO, IUpdateExpeditionDTO } from './types/expedition.type';

export const createExpeditionValidationSchema = Joi.object<ICreateExpeditionDTO>({
  name: Joi.string().required(),
  description: Joi.string().max(255),
  activityTypes: Joi.array().single().min(1).items(Joi.string()).required(),
  routes: Joi.array()
    .min(1)
    .items(
      Joi.object({
        routeId: Joi.string().required(),
        startDateTime: Joi.date().min(new Date()).required(),
      }),
    )
    .required(),
  invites: Joi.array().items(Joi.string()).default([]),
});

export const inviteUsersToExpeditionVSchema = Joi.object({
  invites: Joi.array().min(1).items(Joi.string()).required(),
});

export const updateExpeditionVSchema = Joi.object<IUpdateExpeditionDTO>({
  name: Joi.string(),
  description: Joi.string().max(255),
  activityTypes: Joi.array().single().min(1).items(Joi.string()),
  routes: Joi.array()
    .min(1)
    .items(
      Joi.object({
        routeId: Joi.string().required(),
        startDateTime: Joi.date().min(new Date()).required(),
      }),
    ),
  invites: Joi.array().items(Joi.string()),
  users: Joi.array().items(Joi.string()),
});

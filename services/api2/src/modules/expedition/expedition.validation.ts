import Joi from 'joi';
import { ICreateExpeditionDTO } from './types/expedition.type';

export const createExpeditionValidationSchema = Joi.object<ICreateExpeditionDTO>({
  name: Joi.string().required(),
  description: Joi.string().max(255),
  routes: Joi.array()
    .min(1)
    .items(
      Joi.object({
        routeId: Joi.string().required(),
        startDateTime: Joi.date().min(new Date()).required(),
      }),
    )
    .required(),
});

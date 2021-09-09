import Joi from 'joi';
import { ICreateExpeditionDTO } from './types/expedition.type';

export const expeditionValidationSchema = Joi.object<ICreateExpeditionDTO>({
  name: Joi.string().required(),
  description: Joi.string().max(255),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  altitude: Joi.number(),
  startDateTime: Joi.date().required(),
  endDateTime: Joi.date().min(Joi.ref('startDateTime')).required(),
});

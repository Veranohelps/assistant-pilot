import Joi from 'joi';
import { ICreateAssessmentDTO } from './types/assessment.type';

export const createAssessmentValidationSchema = Joi.object<ICreateAssessmentDTO>({
  levels: Joi.array().min(1).items(Joi.string()).required(),
});

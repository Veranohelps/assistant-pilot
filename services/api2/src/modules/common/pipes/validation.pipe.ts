import { PipeTransform } from '@nestjs/common';
import Joi, { ObjectSchema, ValidationOptions } from 'joi';
import { AppQuery } from '../utilities/app-query';

export class ValidationPipe implements PipeTransform {
  constructor(
    private validationSchema: ObjectSchema = Joi.object({}),
    private options: ValidationOptions = {},
  ) {}

  async transform(value: any) {
    const val = value instanceof AppQuery ? value.query : value;
    const result = await this.validationSchema.validateAsync(val, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
      ...this.options,
    });

    if (value instanceof AppQuery) {
      return new AppQuery(result);
    }

    return result;
  }
}

export function joiPipe(validationSchema: ObjectSchema, options?: ValidationOptions) {
  return new ValidationPipe(validationSchema, options);
}

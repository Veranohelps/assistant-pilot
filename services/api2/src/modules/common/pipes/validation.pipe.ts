import { PipeTransform } from '@nestjs/common';
import { ObjectSchema, ValidationOptions } from 'joi';

export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema, private options: ValidationOptions) {}

  async transform(value: any) {
    const result = await this.schema.validateAsync(value, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
      ...this.options,
    });

    return result;
  }
}

export function joiPipe(schema: ObjectSchema, options?: ValidationOptions) {
  return new ValidationPipe(schema, options ?? {});
}

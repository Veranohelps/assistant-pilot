import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import Joi from 'joi';
import { ValidationPipe } from '../pipes/validation.pipe';

interface IParsedUrlParameterOptions {
  schema: Joi.ObjectSchema;
  options?: Joi.ValidationOptions;
}

export const ParsedUrlParameters = createParamDecorator(
  async (
    schemaOrOptions: IParsedUrlParameterOptions | Joi.ObjectSchema | undefined,
    ctx: ExecutionContext,
  ) => {
    let { query = {} } = ctx.switchToHttp().getRequest() as Request;

    if (schemaOrOptions) {
      let pipe: ValidationPipe | null = null;

      if (Joi.isSchema(schemaOrOptions)) {
        pipe = new ValidationPipe(schemaOrOptions as Joi.ObjectSchema);
      } else {
        const opts = schemaOrOptions as IParsedUrlParameterOptions;

        pipe = new ValidationPipe(opts.schema, opts.options);
      }

      query = await pipe.transform(query);
    }

    return query;
  },
);

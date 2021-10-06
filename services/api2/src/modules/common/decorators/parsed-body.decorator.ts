import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Joi from 'joi';
import { ValidationPipe } from '../pipes/validation.pipe';

interface IParsedBodyOptions {
  schema: Joi.ObjectSchema;
  options?: Joi.ValidationOptions;
}

export const ParsedBody = createParamDecorator(
  async (
    schemaOrOptions: IParsedBodyOptions | Joi.ObjectSchema | undefined,
    ctx: ExecutionContext,
  ) => {
    let { body = {} } = ctx.switchToHttp().getRequest() as Request;

    if (schemaOrOptions) {
      let pipe: ValidationPipe | null = null;

      if (Joi.isSchema(schemaOrOptions)) {
        pipe = new ValidationPipe(schemaOrOptions as Joi.ObjectSchema);
      } else {
        const opts = schemaOrOptions as IParsedBodyOptions;

        pipe = new ValidationPipe(opts.schema, opts.options);
      }

      body = await pipe.transform(body);
    }

    return body;
  },
);

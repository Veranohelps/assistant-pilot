import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestUser } from '../types/request.type';
import { getRequest } from '../utilities/get-request';

export const RequestUser: (key?: keyof IRequestUser) => ParameterDecorator = createParamDecorator(
  (field: keyof IRequestUser | undefined, ctx: ExecutionContext) => {
    const request = getRequest(ctx);
    const { user } = request.rctx;

    if (!user) {
      throw new Error('Route or resolver not authenticated');
    }

    return field ? user[field] : user;
  },
);

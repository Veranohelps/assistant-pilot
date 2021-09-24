import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestUser } from '../types/request.type';
import { getRequest } from '../utilities/get-request';

export const UserData: (key?: keyof IRequestUser['userData']) => ParameterDecorator =
  createParamDecorator(
    (field: keyof IRequestUser['userData'] | undefined, ctx: ExecutionContext) => {
      const request = getRequest(ctx);
      const { userData } = request.rctx.user ?? {};

      if (!userData) {
        throw new Error('Route or resolver not authenticated');
      }

      return field ? userData[field] : userData;
    },
  );

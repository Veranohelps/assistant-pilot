import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { IAppRequest } from '../types/request.type';

export function getRequest(context: ExecutionContext): IAppRequest {
  if (context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  return context.switchToHttp().getRequest();
}

export function getRequestParams(context: ExecutionContext): Record<string, string> {
  if (context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getArgs();
  }

  return context.switchToHttp().getRequest().params;
}

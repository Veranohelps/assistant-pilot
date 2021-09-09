import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-core';
import { BaseHttpError } from '../errors/http.error';

export function handleError(
  context: ExecutionContext | ArgumentsHost,
  error: BaseHttpError,
): Record<string, string> {
  if (context.getType<GqlContextType>() === 'graphql') {
    return new ApolloError(error.message, error.code, { error: error.error });
  }

  return context.switchToHttp().getResponse().status(error.getStatus()).json(error.getResponse());
}

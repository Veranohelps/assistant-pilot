import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ErrorCodes } from '../errors/error-codes';
import { BaseHttpError, NotFoundError, ServerError } from '../errors/http.error';
import { handleError } from '../utilities/handle-error';

@Catch(BaseHttpError, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: BaseHttpError | HttpException, host: ArgumentsHost) {
    console.log(error);

    const err =
      error instanceof BaseHttpError
        ? error
        : error instanceof HttpException
        ? new NotFoundError(ErrorCodes.NOT_FOUND_ERROR, error.message)
        : new ServerError(ErrorCodes.SERVER_ERROR, 'Something went wrong, we are working on it');

    return handleError(host, err);
  }
}

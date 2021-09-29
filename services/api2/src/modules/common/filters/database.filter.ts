import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DatabaseConstraints } from '../../database/database.constraint';
import { DatabaseError } from '../errors/database.error';
import { ErrorCodes } from '../errors/error-codes';
import { BaseHttpError, NotFoundError, ServerError } from '../errors/http.error';
import { handleError } from '../utilities/handle-error';

const errorMap = {
  [DatabaseConstraints.USER_LEVEL_SKILL_ID_FKEY]: new NotFoundError(
    ErrorCodes.SKILL_NOT_FOUND,
    'Skill not found',
  ),
  [DatabaseConstraints.USER_LEVEL_LEVEL_ID_FKEY]: new NotFoundError(
    ErrorCodes.SKILL_LEVEL_NOT_FOUND,
    'Skill level not found',
  ),
} as Record<DatabaseConstraints, BaseHttpError | undefined>;

@Catch(DatabaseError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(error: DatabaseError, host: ArgumentsHost) {
    console.log(error);

    const appError = errorMap[error.constraint];
    const err =
      appError ??
      new ServerError(ErrorCodes.SERVER_ERROR, 'Something went wrong, we are working on it');

    return handleError(host, err);
  }
}

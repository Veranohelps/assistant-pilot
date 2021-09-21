import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCodes } from '../../common/errors/error-codes';
import { UnauthorizedError } from '../../common/errors/http.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: Error, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedError(ErrorCodes.INVALID_TOKEN, 'Provided token is not valid');
    }

    return user;
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import auth from 'basic-auth';
import { ErrorCodes } from '../../common/errors/error-codes';
import { UnauthorizedError } from '../../common/errors/http.error';
import { getRequest } from '../../common/utilities/get-request';

@Injectable()
export class DersuAdminBasicAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = getRequest(context);
    const user = auth(request);

    if (
      user?.name === this.configService.get('DERSU_ADMIN_USERNAME') &&
      user?.pass === this.configService.get('DERSU_ADMIN_PASSWORD')
    ) {
      return true;
    }

    throw new UnauthorizedError(
      ErrorCodes.INVALID_DERSU_ADMIN_CREDENTIALS,
      'Invalid username or password',
    );
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorCodes } from '../../common/errors/error-codes';
import { UnauthorizedError } from '../../common/errors/http.error';
import { getRequest } from '../../common/utilities/get-request';

@Injectable()
export class ApiAdminTokenGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = getRequest(context);
    const token = request.header('x-dersu-api-admin-token');

    if (token !== this.configService.get('API_ADMIN_TOKEN')) {
      throw new UnauthorizedError(
        ErrorCodes.INVALID_API_ADMIN_TOKEN,
        'Supplied token is not valid',
      );
    }

    return true;
  }
}

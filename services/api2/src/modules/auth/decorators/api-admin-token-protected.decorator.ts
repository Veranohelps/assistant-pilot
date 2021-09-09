import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiAdminTokenGuard } from '../guards/api-admin-token.guard';

export function ApiAdminTokenProtected() {
  return applyDecorators(UseGuards(ApiAdminTokenGuard));
}

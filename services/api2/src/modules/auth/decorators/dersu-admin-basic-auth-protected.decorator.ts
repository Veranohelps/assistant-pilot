import { applyDecorators, UseGuards } from '@nestjs/common';
import { DersuAdminBasicAuthGuard } from '../guards/dersu-admin-basic-auth.guard';

export function DersuAdminBasicAuthProtected() {
  return applyDecorators(UseGuards(DersuAdminBasicAuthGuard));
}

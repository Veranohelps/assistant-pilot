import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../guards/admin-jwt-auth.guard';

export function AdminJwtProtected() {
  return applyDecorators(UseGuards(AdminJwtAuthGuard));
}

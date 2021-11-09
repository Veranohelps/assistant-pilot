import { applyDecorators, UseGuards } from '@nestjs/common';
import { PersonalJwtAuthGuard } from '../guards/personal-jwt-auth.guard';

export function JwtProtected() {
  return applyDecorators(UseGuards(PersonalJwtAuthGuard));
}

import { Controller } from '@nestjs/common';
import { AdminJwtProtected } from '../../../auth/decorators/admin-jwt-atuh.guard';

@Controller('admin/user')
@AdminJwtProtected()
export class AdminUserController {}

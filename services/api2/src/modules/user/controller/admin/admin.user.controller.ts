import { Controller } from '@nestjs/common';
import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';

@Controller('admin/user')
@ApiAdminTokenProtected()
export class AdminUserController {}

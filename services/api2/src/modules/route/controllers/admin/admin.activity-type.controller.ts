import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { ActivityTypeService } from '../../services/activity-type.service';

@Controller('admin/activity-type')
@ApiAdminTokenProtected()
export class AdminActivityTypeController {
  constructor(private activityTypeService: ActivityTypeService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    const activityTypes = this.activityTypeService.all();

    return successResponse('Activity types', { activityTypes });
  }
}

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminJwtProtected } from '../../../auth/decorators/admin-jwt-atuh.guard';
import { successResponse } from '../../../common/utilities/success-response';
import { ActivityTypeService } from '../../services/activity-type.service';

@Controller('admin/activity-type')
@AdminJwtProtected()
export class AdminActivityTypeController {
  constructor(private activityTypeService: ActivityTypeService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    const activityTypes = this.activityTypeService.all();

    return successResponse('Activity types', { activityTypes });
  }
}

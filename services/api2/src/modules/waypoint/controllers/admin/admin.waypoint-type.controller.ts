import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { WaypointTypeService } from '../../services/waypoint-type.service';

@Controller('admin/waypoint-type')
@ApiAdminTokenProtected()
export class AdminWaypointTypeController {
  constructor(private waypointTypeService: WaypointTypeService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    const waypointTypes = this.waypointTypeService.all();

    return successResponse('Waypoint types', { waypointTypes });
  }
}

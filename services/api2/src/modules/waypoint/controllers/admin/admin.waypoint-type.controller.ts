import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminJwtProtected } from '../../../auth/decorators/admin-jwt-atuh.guard';
import { successResponse } from '../../../common/utilities/success-response';
import { WaypointTypeService } from '../../services/waypoint-type.service';

@Controller('admin/waypoint-type')
@AdminJwtProtected()
export class AdminWaypointTypeController {
  constructor(private waypointTypeService: WaypointTypeService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    const waypointTypes = this.waypointTypeService.all();

    return successResponse('Waypoint types', { waypointTypes });
  }
}

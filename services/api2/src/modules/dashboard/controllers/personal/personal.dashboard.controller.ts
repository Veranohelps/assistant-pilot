import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/personal-jwt-protected.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { IUser } from '../../../user/types/user.type';
import { DashboardService } from '../../services/dashboard.service';

@Controller('personal/dashboard')
@JwtProtected()
export class PersonalDashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllExpeditions(@UserData() user: IUser) {
    const modules = await this.dashboardService.getModules(user.id);

    return successResponse('Dashboard', { modules });
  }
}

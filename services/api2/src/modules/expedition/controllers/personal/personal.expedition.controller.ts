import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/jwt-protected.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { ExpeditionService } from '../../services/expedition.service';

@Controller('personal/expedition')
@JwtProtected()
export class PersonalExpeditionController {
  constructor(private expeditionService: ExpeditionService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllExpeditions() {
    const expeditions = await this.expeditionService.getExpeditionsFull('personal');

    return successResponse('fetch personal expeditions', { expeditions });
  }
}

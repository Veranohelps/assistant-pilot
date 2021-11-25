import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { successResponse } from '../common/utilities/success-response';

@Controller('health')
export class HealthController {
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async health() {
    return successResponse('Dersu API is healthy', {});
  }
}

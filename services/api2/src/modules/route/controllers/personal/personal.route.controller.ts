import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/jwt-protected.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { RouteService } from '../../services/route.service';

@Controller('personal/route')
@JwtProtected()
export class PersonalRouteController {
  constructor(private routeService: RouteService) {}

  @Get(':routeId')
  @HttpCode(HttpStatus.CREATED)
  async getRoute(@Tx() tx: TransactionManager, @Param('routeId') id: string) {
    const route = await this.routeService.findOne(tx, id);

    return successResponse('fetch route success', { route });
  }
}

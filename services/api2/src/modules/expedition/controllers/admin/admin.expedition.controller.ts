import { Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { AdminJwtProtected } from '../../../auth/decorators/admin-jwt-atuh.guard';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { ExpeditionService } from '../../services/expedition.service';

@Controller('admin/expedition')
@AdminJwtProtected()
export class AdminExpeditionController {
  constructor(private expeditionService: ExpeditionService) {}

  @Patch(':expeditionId/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshExpedition(
    @Tx() tx: TransactionManager,
    @Param('expeditionId') expeditionId: string,
  ) {
    const expedition = await this.expeditionService.refreshExpedition(tx, expeditionId);

    return successResponse('Expedition refreshed', { expedition });
  }

  @Patch('refresh/all')
  @HttpCode(HttpStatus.OK)
  async refreshAllExpedition(@Tx() tx: TransactionManager) {
    await this.expeditionService.refreshAllExpeditions(tx);

    return successResponse('All expeditions refreshed successfully');
  }
}

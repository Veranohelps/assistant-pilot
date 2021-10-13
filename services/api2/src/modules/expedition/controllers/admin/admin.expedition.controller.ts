import { Controller } from '@nestjs/common';
import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';
import { ExpeditionService } from '../../services/expedition.service';

@Controller('admin/expedition')
@ApiAdminTokenProtected()
export class AdminExpeditionController {
  constructor(private expeditionService: ExpeditionService) {}
}

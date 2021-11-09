import { Controller } from '@nestjs/common';
import { AdminJwtProtected } from '../../../auth/decorators/admin-jwt-atuh.guard';
import { ExpeditionService } from '../../services/expedition.service';

@Controller('admin/expedition')
@AdminJwtProtected()
export class AdminExpeditionController {
  constructor(private expeditionService: ExpeditionService) {}
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { joiPipe } from '../../../common/pipes/validation.pipe';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { expeditionValidationSchema } from '../../expedition.validation';
import { ExpeditionService } from '../../services/expedition.service';
import { ICreateExpeditionDTO } from '../../types/expedition.type';

@Controller('admin/expedition')
@ApiAdminTokenProtected()
export class AdminExpeditionController {
  constructor(private expeditionService: ExpeditionService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('gpx'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Tx() tx: TransactionManager,
    @Body(joiPipe(expeditionValidationSchema)) payload: ICreateExpeditionDTO,
  ) {
    const expedition = await this.expeditionService.createFromGeojson(tx, payload, file);

    return successResponse('create expedition success', { expedition });
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllExpeditions() {
    const expeditions = await this.expeditionService.getExpeditionsFull('admin');

    return successResponse('fetch expeditions success', { expeditions });
  }
}

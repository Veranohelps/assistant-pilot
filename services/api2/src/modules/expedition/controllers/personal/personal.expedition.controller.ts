import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/jwt-protected.decorator';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import withUrl, { appUrls } from '../../../common/utilities/with-url';
import { IUser } from '../../../user/types/user.type';
import { createExpeditionValidationSchema } from '../../expedition.validation';
import { ExpeditionService } from '../../services/expedition.service';
import { ICreateExpeditionDTO, IExpedition } from '../../types/expedition.type';

@Controller('personal/expedition')
@JwtProtected()
export class PersonalExpeditionController {
  constructor(private expeditionService: ExpeditionService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllExpeditions(@UserData() user: IUser) {
    const expeditions = await this.expeditionService.getExpeditionsFull(user.id);

    withUrl(expeditions, (e: IExpedition) => appUrls.personal.expedition.id(e.id));

    return successResponse('fetch personal expeditions', { expeditions });
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @ParsedBody(createExpeditionValidationSchema) payload: ICreateExpeditionDTO,
  ) {
    const expedition = await this.expeditionService.create(tx, user.id, payload);

    return successResponse('create expedition success', { expedition });
  }

  @Get(':expeditionId')
  @HttpCode(HttpStatus.OK)
  async getExpedition(@UserData() user: IUser, @Param('expeditionId') id: string) {
    const expedition = await this.expeditionService.getExpeditionFull(null, id, user.id);

    return successResponse('Fetch expedition', { expedition });
  }
}

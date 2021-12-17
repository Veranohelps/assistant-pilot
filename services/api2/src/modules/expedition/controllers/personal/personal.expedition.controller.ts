import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/personal-jwt-protected.decorator';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { ErrorCodes } from '../../../common/errors/error-codes';
import { NotFoundError } from '../../../common/errors/http.error';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import withUrl, { appUrls } from '../../../common/utilities/with-url';
import { IUser } from '../../../user/types/user.type';
import { WeatherService } from '../../../weather/services/weather.service';
import {
  createExpeditionValidationSchema,
  updateExpeditionVSchema,
} from '../../expedition.validation';
import { ExpeditionUserRouteLogService } from '../../services/expedition-user-route-log.service';
import { ExpeditionRouteService } from '../../services/expedition-route.service';
import { ExpeditionService } from '../../services/expedition.service';
import {
  ICreateExpeditionDTO,
  IExpedition,
  IUpdateExpeditionDTO,
} from '../../types/expedition.type';

@Controller('personal/expedition')
@JwtProtected()
export class PersonalExpeditionController {
  constructor(
    private expeditionService: ExpeditionService,
    private expeditionRouteService: ExpeditionRouteService,
    private weatherService: WeatherService,
    private expeditionLogService: ExpeditionUserRouteLogService,
  ) {}

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

  @Patch(':expeditionId/update')
  @HttpCode(HttpStatus.OK)
  async update(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') expeditionId: string,
    @ParsedBody(updateExpeditionVSchema) payload: IUpdateExpeditionDTO,
  ) {
    const expedition = await this.expeditionService.updateExpedition(
      tx,
      expeditionId,
      user.id,
      payload,
    );

    return successResponse('Update expedition success', { expedition });
  }

  @Get(':expeditionId')
  @HttpCode(HttpStatus.OK)
  async getExpedition(@UserData() user: IUser, @Param('expeditionId') id: string) {
    const expedition = await this.expeditionService.getExpeditionFull(null, id, user.id);

    return successResponse('Fetch expedition', { expedition });
  }

  @Get(':expeditionId/weather')
  @HttpCode(HttpStatus.OK)
  async getRouteWeather(@Tx() tx: TransactionManager, @Param('expeditionId') id: string) {
    const expeditionRoutes = await this.expeditionRouteService.getWithRoutes(tx, [id]);
    if (!expeditionRoutes[id] || expeditionRoutes[id].length == 0) {
      throw new NotFoundError(ErrorCodes.EXPEDITION_NOT_FOUND, 'Expedition not found');
    }

    const expeditionRoute = expeditionRoutes[id][0];
    const dailyMode = this.weatherService.calculateDailyMode(expeditionRoute.startDateTime);
    const apiResponse = await this.weatherService.getForecast(expeditionRoute.route, dailyMode);

    return apiResponse;
  }

  @Patch(':expeditionId/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelExpedition(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') id: string,
  ) {
    const expedition = await this.expeditionService.cancelExpedition(tx, id, user.id);

    return successResponse('Expedition cancelled', { expedition });
  }

  @Get('user/log')
  @HttpCode(HttpStatus.OK)
  async getLog(@UserData() user: IUser) {
    const expeditions = await this.expeditionLogService.getUserExpeditionLog(user.id);
    withUrl(expeditions, (e) => appUrls.personal.expedition.user.log.id(e.id));
    return successResponse('Expedition log', { expeditions });
  }

  @Get('user/log/:expeditionLogId')
  @HttpCode(HttpStatus.OK)
  async getLogById(@UserData() user: IUser, @Param('expeditionLogId') id: string) {
    const expedition = await this.expeditionLogService.getExpeditionLogById(user.id, id);
    return successResponse('Expedition log', { expedition });
  }
}

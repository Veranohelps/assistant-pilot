import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/jwt-protected.decorator';
import { ParsedUrlParameters } from '../../../common/decorators/parsed-url-parameters.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { AppQuery } from '../../../common/utilities/app-query';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { IUser } from '../../../user/types/user.type';
import {
  getDateQueryValidationSchema,
  getRoutesQueryValidationSchema,
} from '../../route.validation-schema';
import { RouteService } from '../../services/route.service';
import { WeatherService } from '../../services/weather.service';
import { IGetRoutesUrlParameters } from '../../types/route.type';
import { IGetRouteWeatherUrlParameters } from '../../types/wheather-prediction.type';

@Controller('personal/route')
@JwtProtected()
export class PersonalRouteController {
  constructor(private routeService: RouteService, private weatherService: WeatherService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getUserRoutes(
    @UserData() user: IUser,
    @ParsedUrlParameters(getRoutesQueryValidationSchema)
    urlParameters: AppQuery<IGetRoutesUrlParameters>,
  ) {
    const route = await this.routeService.getUserRoutes(null, user.id, urlParameters);

    return successResponse('fetch personal routes success', { route });
  }

  @Get(':routeId')
  @HttpCode(HttpStatus.CREATED)
  async getRoute(@Tx() tx: TransactionManager, @Param('routeId') id: string) {
    const route = await this.routeService.findOne(tx, id);
    return successResponse('fetch route success', { route });
  }

  @Get(':routeId/weather')
  @HttpCode(HttpStatus.OK)
  async getRouteWeather(
    @Tx() tx: TransactionManager,
    @Param('routeId') id: string,
    @ParsedUrlParameters(getDateQueryValidationSchema)
    urlParameters: AppQuery<IGetRouteWeatherUrlParameters>,
  ) {
    const route = await this.routeService.findOne(tx, id);
    const apiResponse = await this.weatherService.getForecast(route.coordinate, urlParameters);
    return apiResponse;
  }
}

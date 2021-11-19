import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/personal-jwt-protected.decorator';
import { ParsedUrlParameters } from '../../../common/decorators/parsed-url-parameters.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { IMultiPointGeometry } from '../../../common/types/geojson.type';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import withUrl, { appUrls } from '../../../common/utilities/with-url';
import { IUser } from '../../../user/types/user.type';
import { WeatherService } from '../../../weather/services/weather.service';
import {
  getRouteValidationSchema,
  getUserRoutesQueryValidationSchema,
} from '../../route.validation-schema';
import { RouteService } from '../../services/route.service';
import {
  IGetRouteUrlParameters,
  IGetUserRoutesUrlParameters,
  IRouteSlim,
} from '../../types/route.type';

@Controller('personal/route')
@JwtProtected()
export class PersonalRouteController {
  constructor(private routeService: RouteService, private weatherService: WeatherService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getUserRoutes(
    @UserData() user: IUser,
    @ParsedUrlParameters(getUserRoutesQueryValidationSchema)
    urlParameters: IGetUserRoutesUrlParameters,
  ) {
    const routes = await this.routeService.getUserRoutes(null, user.id, urlParameters);

    withUrl(routes, (r: IRouteSlim) => appUrls.personal.route.id(r.id));

    return successResponse('fetch personal routes success', { routes });
  }

  @Get(':routeId')
  @HttpCode(HttpStatus.OK)
  async getRoute(
    @Tx() tx: TransactionManager,
    @Param('routeId') id: string,
    @ParsedUrlParameters(getRouteValidationSchema)
    urlParameters: IGetRouteUrlParameters,
  ) {
    const route = await this.routeService.findOneWithWaypoints(tx, id, urlParameters);

    return successResponse('fetch route success', { route });
  }

  @Get(':routeId/weather')
  @HttpCode(HttpStatus.OK)
  async getRouteWeather(@Tx() tx: TransactionManager, @Param('routeId') id: string) {
    const route = await this.routeService.findOne(tx, id);
    const apiResponse = await this.weatherService.getForecast(
      route.meteoPointsOfInterests as IMultiPointGeometry,
    );

    return apiResponse;
  }
}

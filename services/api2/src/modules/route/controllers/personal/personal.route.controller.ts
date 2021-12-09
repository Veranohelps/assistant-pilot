import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtProtected } from '../../../auth/decorators/personal-jwt-protected.decorator';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { ParsedUrlParameters } from '../../../common/decorators/parsed-url-parameters.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import gpxToGeoJSON from '../../../common/utilities/gpx-to-geojson';
import { SuccessResponse, successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import withUrl, { appUrls } from '../../../common/utilities/with-url';
import { IUser } from '../../../user/types/user.type';
import { WeatherService } from '../../../weather/services/weather.service';
import {
  createNoDersuRouteValidationSchema,
  getRouteValidationSchema,
  getUserRoutesQueryValidationSchema,
} from '../../route.validation-schema';
import { RouteService } from '../../services/route.service';
import { ERouteOrigins } from '../../types/route-origin.type';
import {
  ICreateRouteDTO,
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
  async getRouteWeather(@Param('routeId') id: string) {
    const weather = await this.routeService.getRouteWeather(id);

    return SuccessResponse.transform(weather);
  }

  @Get(':routeId/weather2')
  @HttpCode(HttpStatus.OK)
  async getRouteWeather2(@Param('routeId') id: string) {
    const weather = await this.routeService.getRouteWeather(id);

    return successResponse('Route weather report', { weather });
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('gpx'))
  async create(
    @UserData() user: IUser,
    @UploadedFile() file: Express.Multer.File,
    @Tx() tx: TransactionManager,
    @ParsedBody(createNoDersuRouteValidationSchema) payload: ICreateRouteDTO,
  ) {
    const route = await this.routeService.fromGeoJson(
      tx,
      ERouteOrigins.MANUAL,
      payload,
      gpxToGeoJSON(file.buffer.toString('utf-8')),
      user.id,
    );

    return successResponse('Route created', { route });
  }
  @Patch(':routeId/update')
  @HttpCode(HttpStatus.OK)
  async updateUserRoute(
    @UserData() user: IUser,
    @Tx() tx: TransactionManager,
    @Param('routeId') id: string,
    @ParsedBody() payload: ICreateRouteDTO,
  ) {
    const route = await this.routeService.updateUserRoute(tx, id, payload, user.id);
    return successResponse('Route updated', { route });
  }
}

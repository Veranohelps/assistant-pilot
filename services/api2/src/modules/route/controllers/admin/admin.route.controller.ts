import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import gpxToGeoJSON from '../../../common/utilities/gpx-to-geojson';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import withUrl, { appUrls } from '../../../common/utilities/with-url';
import { createRouteValidationSchema } from '../../route.validation-schema';
import { RouteService } from '../../services/route.service';
import { ERouteOrigins } from '../../types/route-origin.type';
import { ICreateRouteDTO, IRouteSlim } from '../../types/route.type';

@Controller('admin/route')
@ApiAdminTokenProtected()
export class AdminRouteController {
  constructor(private routeService: RouteService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getRoutes() {
    const routes = await this.routeService.getAdminRoutes();

    withUrl(routes, (r: IRouteSlim) => appUrls.admin.route.id(r.id));

    return successResponse('fetch routes success', { routes });
  }

  @Get(':routeId')
  @HttpCode(HttpStatus.OK)
  async getRoute(@Param('routeId') id: string) {
    const route = await this.routeService.findOne(null, id);

    return successResponse('fetch route success', { route });
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('gpx'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Tx() tx: TransactionManager,
    @ParsedBody(createRouteValidationSchema) payload: ICreateRouteDTO,
  ) {
    const result = await this.routeService.fromGeoJson(
      tx,
      ERouteOrigins.DERSU,
      payload,
      gpxToGeoJSON(file.buffer.toString('utf-8')),
    );

    return successResponse('Route created', result);
  }
}

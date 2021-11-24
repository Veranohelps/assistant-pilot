import {
  Controller,
  Delete,
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
import { AdminJwtProtected } from '../../../auth/decorators/admin-jwt-atuh.guard';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import gpxToGeoJSON from '../../../common/utilities/gpx-to-geojson';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import withUrl, { appUrls } from '../../../common/utilities/with-url';
import {
  createRouteValidationSchema,
  updateRouteValidationSchema,
} from '../../route.validation-schema';
import { RouteService } from '../../services/route.service';
import { ERouteOrigins } from '../../types/route-origin.type';
import { ICreateRouteDTO, IRouteSlim } from '../../types/route.type';

@Controller('admin/route')
@AdminJwtProtected()
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
    const route = await this.routeService.findOneWithWaypoints(null, id);

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
    const route = await this.routeService.fromGeoJson(
      tx,
      ERouteOrigins.DERSU,
      payload,
      gpxToGeoJSON(file.buffer.toString('utf-8')),
    );

    return successResponse('Route created', { route });
  }

  @Post(':routeId/clone')
  @HttpCode(HttpStatus.CREATED)
  async clone(
    @Tx() tx: TransactionManager,
    @ParsedBody(createRouteValidationSchema) payload: ICreateRouteDTO,
    @Param('routeId') routeId: string,
  ) {
    const route = await this.routeService.cloneRoute(tx, routeId, payload);

    return successResponse('Route cloned', { route });
  }

  @Patch(':routeId/update')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('gpx'))
  async edit(
    @UploadedFile() file: Express.Multer.File,
    @Tx() tx: TransactionManager,
    @Param('routeId') routeId: string,
    @ParsedBody(updateRouteValidationSchema) payload: Partial<ICreateRouteDTO>,
  ) {
    const route = await this.routeService.updateRoute(
      tx,
      routeId,
      ERouteOrigins.DERSU,
      payload,
      null,
      file?.buffer ? gpxToGeoJSON(file.buffer.toString('utf-8')) : null,
    );

    return successResponse('Route updated', { route });
  }

  @Delete(':routeId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('gpx'))
  async deleteRoute(
    @UploadedFile() file: Express.Multer.File,
    @Tx() tx: TransactionManager,
    @Param('routeId') routeId: string,
  ) {
    await this.routeService.deleteRoute(tx, routeId, ERouteOrigins.DERSU);

    return successResponse('Route deleted');
  }

  @Patch(':routeId/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshRoute(@Tx() tx: TransactionManager, @Param('routeId') routeId: string) {
    const route = await this.routeService.refreshRoute(tx, routeId);

    return successResponse('Route refreshed', { route });
  }

  @Patch('refresh/all')
  @HttpCode(HttpStatus.OK)
  async refreshAllRoute(@Tx() tx: TransactionManager) {
    await this.routeService.refreshAllRoutes(tx);

    return successResponse('All routes refreshed successfully');
  }
}

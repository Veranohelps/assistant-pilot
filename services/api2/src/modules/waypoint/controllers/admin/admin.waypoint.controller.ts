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
import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import gpxToGeoJSON from '../../../common/utilities/gpx-to-geojson';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import withUrl, { appUrls } from '../../../common/utilities/with-url';
import { ERouteOrigins } from '../../../route/types/route-origin.type';
import { WaypointService } from '../../services/waypoint.service';
import {
  ICreateWaypointDTO,
  IFindWaypointByBoundingBoxUrlParameters,
  IWaypoint,
} from '../../types/waypoint.type';
import {
  createWaypointValidationSchema,
  findWaypointByBoundingBoxValidationSchema,
  updateWaypointValidationSchema,
} from '../../waypoint.validation-schema';

@Controller('admin/waypoint')
@ApiAdminTokenProtected()
export class AdminWaypointController {
  constructor(private waypointService: WaypointService) {}

  @Get(':waypointId')
  @HttpCode(HttpStatus.OK)
  async getWaypoint(@Param('waypointId') id: string) {
    const waypoint = await this.waypointService.findOne(null, id, {
      originId: ERouteOrigins.DERSU,
    });

    return successResponse('Waypoint', { waypoint });
  }

  @Post('create-bulk')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('gpx'))
  async createBulk(@UploadedFile() file: Express.Multer.File, @Tx() tx: TransactionManager) {
    const result = await this.waypointService.fromGeoJson(
      tx,
      ERouteOrigins.DERSU,
      null,
      gpxToGeoJSON(file.buffer.toString('utf-8')),
    );

    return successResponse('Waypoints created', result);
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(
    @Tx() tx: TransactionManager,
    @ParsedBody(createWaypointValidationSchema) payload: ICreateWaypointDTO,
  ) {
    const waypoint = await this.waypointService.createWaypoint(
      tx,
      ERouteOrigins.DERSU,
      null,
      payload,
    );

    return successResponse('Waypoint created', { waypoint });
  }

  @Patch(':waypointId/update')
  @HttpCode(HttpStatus.OK)
  async edit(
    @Tx() tx: TransactionManager,
    @Param('waypointId') waypointId: string,
    @ParsedBody(updateWaypointValidationSchema) payload: Partial<ICreateWaypointDTO>,
  ) {
    const waypoint = await this.waypointService.updateWaypoint(
      tx,
      waypointId,
      ERouteOrigins.DERSU,
      null,
      payload,
    );

    return successResponse('Waypoint updated', { waypoint });
  }

  @Delete(':waypointId')
  @HttpCode(HttpStatus.OK)
  async deleteRoute(@Tx() tx: TransactionManager, @Param('waypointId') waypointId: string) {
    await this.waypointService.delete(tx, waypointId, {
      originId: ERouteOrigins.DERSU,
    });

    return successResponse('Waypoint deleted');
  }

  @Post('by-bounding-box')
  @HttpCode(HttpStatus.OK)
  async getWaypointsByGeom(
    @ParsedBody(findWaypointByBoundingBoxValidationSchema)
    payload: IFindWaypointByBoundingBoxUrlParameters,
  ) {
    const waypoints = await this.waypointService.findByBoundingBox(null, payload.boundingBox, {
      originId: ERouteOrigins.DERSU,
    });

    withUrl(waypoints, (w: IWaypoint) => appUrls.admin.waypoint.id(w.id));

    return successResponse('Waypoints', { waypoints });
  }
}

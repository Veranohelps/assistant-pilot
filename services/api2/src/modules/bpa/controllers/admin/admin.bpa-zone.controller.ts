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
import { AdminJwtProtected } from '../../../auth/decorators/admin-jwt-atuh.guard';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import gpxToGeoJSON from '../../../common/utilities/gpx-to-geojson';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { createBpaZoneVSchema } from '../../bpa.validation-schema';
import { BpaZoneService } from '../../services/bpa-zone.service';
import { ICreateBpaZoneDTO } from '../../types/bpa-zone.type';

@Controller('admin/bpa/zone')
@AdminJwtProtected()
export class AdminBpaZoneController {
  constructor(private bpaZoneService: BpaZoneService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getZones() {
    const zones = await this.bpaZoneService.getZones();

    return successResponse('BPA zones', { zones });
  }

  @Get(':zoneId')
  @HttpCode(HttpStatus.OK)
  async getZone(@Param('zoneId') id: string) {
    const zone = await this.bpaZoneService.findOne(null, id);

    return successResponse('BPA zone', { zone });
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('gpx'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Tx() tx: TransactionManager,
    @ParsedBody(createBpaZoneVSchema) payload: ICreateBpaZoneDTO,
  ) {
    const zone = await this.bpaZoneService.create(
      tx,
      payload,
      gpxToGeoJSON(file.buffer.toString('utf-8')),
    );

    return successResponse('BPA zone created', { zone });
  }
}

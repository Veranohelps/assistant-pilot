import {
  Controller,
  Delete,
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
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { createBpaReportVSchema } from '../../bpa.validation-schema';
import { BpaReportService } from '../../services/bpa-report.service';
import { ICreateBpaReportDTO } from '../../types/bpa-report.type';

@Controller('admin/bpa/report')
@AdminJwtProtected()
export class AdminBpaReportController {
  constructor(private bpaReportService: BpaReportService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getReports() {
    const reports = await this.bpaReportService.getReports();

    return successResponse('BPA reports', { reports });
  }

  @Get(':reportId')
  @HttpCode(HttpStatus.OK)
  async getReport(@Param('reportId') id: string) {
    const report = await this.bpaReportService.findOne(null, id);

    return successResponse('BPA report', { report });
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('pdf'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Tx() tx: TransactionManager,
    @ParsedBody(createBpaReportVSchema) payload: ICreateBpaReportDTO,
  ) {
    const report = await this.bpaReportService.create(tx, payload, file);

    return successResponse('BPA report created', { report });
  }

  @Post(':reportId/update')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('pdf'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Tx() tx: TransactionManager,
    @ParsedBody(createBpaReportVSchema) payload: ICreateBpaReportDTO,
    @Param('reportId') id: string,
  ) {
    const report = await this.bpaReportService.update(tx, id, payload, file ?? null);

    return successResponse('BPA report created', { report });
  }

  @Delete(':reportId')
  @HttpCode(HttpStatus.OK)
  async delete(@Tx() tx: TransactionManager, @Param('reportId') id: string) {
    const report = await this.bpaReportService.deleteReport(tx, id);

    return successResponse('BPA report deleted', { report });
  }
}

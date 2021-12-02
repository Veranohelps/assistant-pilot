import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError, NotFoundError } from '../../common/errors/http.error';
import { GcpUploadService } from '../../common/services/gcp-upload.service';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import AddFields from '../../common/utilities/add-fields';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IBpaReport, ICreateBpaReportDTO } from '../types/bpa-report.type';
import { BpaProviderService } from './bpa-provider.service';
import { BpaZoneService } from './bpa-zone.service';

@Injectable()
export class BpaReportService {
  constructor(
    @InjectKnexClient('BpaReport')
    private db: KnexClient<'BpaReport'>,
    private configService: ConfigService,
    private gcpUploadService: GcpUploadService,
    private bpaZoneService: BpaZoneService,
    private bpaProviderService: BpaProviderService,
  ) {}

  private bpaBucket: string = this.configService.get('BPA_BUCKET_NAME') as string;

  async create(
    tx: TransactionManager,
    payload: ICreateBpaReportDTO,
    file: Express.Multer.File,
  ): Promise<IBpaReport[]> {
    const mimetype = file.mimetype.toLowerCase();

    if (mimetype !== 'application/pdf') {
      throw new BadRequestError(ErrorCodes.INVALID_MIME_TYPE, 'MimeType must be: application/pdf');
    }

    const provider = await this.bpaProviderService.findOne(tx, payload.providerId);

    if (provider.disabled) {
      throw new BadRequestError(
        ErrorCodes.BPA_PROVIDER_DISABLED,
        'Report cannot be created by a disabled provider',
      );
    }

    const fileUrl = await this.gcpUploadService.uploadFile(tx, this.bpaBucket, file);
    const reports = await this.db
      .write(tx)
      .insert(
        payload.zoneIds.map((zoneId) => ({
          zoneId,
          providerId: payload.providerId,
          publishDate: payload.publishDate,
          validUntilDate: payload.validUntilDate,
          resourceUrl: fileUrl,
        })),
      )
      .cReturning();

    return reports;
  }

  async deleteReport(tx: TransactionManager, id: string): Promise<IBpaReport> {
    const [deleted] = await this.db.write(tx).where({ id }).del().cReturning();

    await this.gcpUploadService.deleteFile(tx, this.bpaBucket, deleted.resourceUrl);

    if (!deleted) {
      throw new NotFoundError(ErrorCodes.BPA_REPORT_NOT_FOUND, 'BPA report not found');
    }

    return deleted;
  }

  async findOne(tx: TransactionManager | null, id: string): Promise<IBpaReport> {
    const report = await this.db.read(tx).where({ id }).first();

    if (!report) {
      throw new NotFoundError(ErrorCodes.BPA_REPORT_NOT_FOUND, 'BPA report not found');
    }

    return report;
  }

  async getTrackReports(
    tx: TransactionManager | null,
    track: ILineStringGeometry,
  ): Promise<IBpaReport[]> {
    const zones = await this.bpaZoneService.getZonesForTrack(tx, track);

    if (!zones.length) return [];

    const reports = await this.db
      .read(tx)
      .whereIn(
        'zoneId',
        zones.map((z) => z.id),
      )
      .where('validUntilDate', '>=', this.db.knex.fn.now());

    return reports;
  }

  async getReports(): Promise<IBpaReport[]> {
    const reports = await this.db
      .read()
      .orderBy('publishDate', 'desc')
      .then((res) =>
        AddFields.target(res)
          .add(
            'zone',
            () =>
              this.bpaZoneService.findByIds(
                null,
                res.map((r) => r.zoneId),
              ),
            (report, record) => record[report.zoneId],
          )
          .add(
            'provider',
            () =>
              this.bpaProviderService.findByIds(
                null,
                res.map((r) => r.providerId),
              ),
            (report, record) => record[report.providerId],
          ),
      );

    return reports;
  }
}

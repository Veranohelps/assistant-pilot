import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { endOfDay, startOfDay } from 'date-fns';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError, NotFoundError } from '../../common/errors/http.error';
import { GcpUploadService } from '../../common/services/gcp-upload.service';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import AddFields from '../../common/utilities/add-fields';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IBpaReport, IBpaReportFull, ICreateBpaReportDTO } from '../types/bpa-report.type';
import { BpaProviderService } from './bpa-provider.service';
import { BpaZoneReportService } from './bpa-zone-report.service';
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
    private bpaZoneReportService: BpaZoneReportService,
  ) {}

  private bpaBucket: string = this.configService.get('BPA_BUCKET_NAME') as string;

  async updateCounts(tx: TransactionManager, report: IBpaReport, delta: number): Promise<boolean> {
    this.bpaZoneService.updateReportCount(tx, report.zoneIds, delta);
    this.bpaProviderService.updateReportCount(tx, report.providerId, delta);

    return true;
  }

  async create(
    tx: TransactionManager,
    payload: ICreateBpaReportDTO,
    file: Express.Multer.File,
  ): Promise<IBpaReport> {
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
    const [report] = await this.db
      .write(tx)
      .insert({
        zoneIds: payload.zoneIds,
        providerId: payload.providerId,
        publishDate: startOfDay(payload.publishDate),
        validUntilDate: endOfDay(payload.validUntilDate),
        resourceUrl: fileUrl,
      })
      .cReturning();

    await this.bpaZoneReportService.updateZones(tx, report.id, payload.zoneIds);
    await this.updateCounts(tx, report, 1);

    return report;
  }

  async update(
    tx: TransactionManager,
    id: string,
    payload: ICreateBpaReportDTO,
    file: Express.Multer.File | null,
  ): Promise<IBpaReport> {
    let report = await this.findOne(tx, id);

    // decrement counts
    await this.updateCounts(tx, report, -1);

    if (file) {
      const mimetype = file.mimetype.toLowerCase();

      if (mimetype !== 'application/pdf') {
        throw new BadRequestError(
          ErrorCodes.INVALID_MIME_TYPE,
          'MimeType must be: application/pdf',
        );
      }

      await this.gcpUploadService.deleteFile(tx, this.bpaBucket, report.resourceUrl);
    }

    if (payload.providerId) {
      const provider = await this.bpaProviderService.findOne(tx, payload.providerId);

      if (provider.disabled) {
        throw new BadRequestError(
          ErrorCodes.BPA_PROVIDER_DISABLED,
          'Report cannot be created by a disabled provider',
        );
      }
    }

    const fileUrl = file
      ? await this.gcpUploadService.uploadFile(tx, this.bpaBucket, file)
      : undefined;

    [report] = await this.db
      .write(tx)
      .where({ id })
      .update({
        zoneIds: payload.zoneIds,
        providerId: payload.providerId,
        ...(payload.publishDate && { publishDate: startOfDay(payload.publishDate) }),
        ...(payload.validUntilDate && { validUntilDate: endOfDay(payload.validUntilDate) }),
        resourceUrl: fileUrl,
      })
      .cReturning();

    await this.bpaZoneReportService.updateZones(tx, report.id, payload.zoneIds);

    // increment counts
    await this.updateCounts(tx, report, 1);

    return report;
  }

  async deleteReport(tx: TransactionManager, id: string): Promise<IBpaReport> {
    await this.bpaZoneReportService.deleteReport(tx, id);

    const [deleted] = await this.db.write(tx).where({ id }).del().cReturning();

    await this.updateCounts(tx, deleted, -1);
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
      .where(
        'zoneIds',
        '&&',
        zones.map((z) => z.id),
      )
      .where('validUntilDate', '>=', this.db.knex.fn.now());

    return reports;
  }

  async getReports(): Promise<IBpaReportFull[]> {
    const reports = await this.db
      .read()
      .orderBy('publishDate', 'desc')
      .then((res) =>
        AddFields.target(res)
          .add(
            'zones',
            () => this.bpaZoneService.findByIds(null, res.map((r) => r.zoneIds).flat()),
            (report, record) => report.zoneIds.map((zoneId) => record[zoneId]),
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

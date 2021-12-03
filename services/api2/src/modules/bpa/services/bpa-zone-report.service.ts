import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IBpaZoneReport } from '../types/bpa-zone-report.type';
import { BpaProviderService } from './bpa-provider.service';
import { BpaZoneService } from './bpa-zone.service';

@Injectable()
export class BpaZoneReportService {
  constructor(
    @InjectKnexClient('BpaZoneReport')
    private db: KnexClient<'BpaZoneReport'>,
    private bpaZoneService: BpaZoneService,
    private bpaProviderService: BpaProviderService,
  ) {}

  async updateZones(
    tx: TransactionManager,
    reportId: string,
    zoneIds: string[],
  ): Promise<IBpaZoneReport[]> {
    // handle deleted zones
    await this.db.write(tx).where({ reportId }).whereNotIn('zoneId', zoneIds).del();

    const zoneReports = await this.db
      .write(tx)
      .insert(
        zoneIds.map((zoneId) => ({
          reportId,
          zoneId,
        })),
      )
      .onConflict(['zoneId', 'reportId'])
      .merge(['zoneId'] as any)
      .cReturning();

    return zoneReports;
  }

  async deleteReport(tx: TransactionManager, reportId: string): Promise<IBpaZoneReport[]> {
    // handle deleted zones
    const deleted = await this.db.write(tx).where({ reportId }).del().cReturning();

    return deleted;
  }
}

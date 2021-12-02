import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AdminBpaProviderController } from './controllers/admin/admin.bpa-provider.controller';
import { AdminBpaReportController } from './controllers/admin/admin.bpa-report.controller';
import { AdminBpaZoneController } from './controllers/admin/admin.bpa-zone.controller';
import { BpaProviderService } from './services/bpa-provider.service';
import { BpaReportService } from './services/bpa-report.service';
import { BpaZoneService } from './services/bpa-zone.service';

@Module({
  imports: [DatabaseModule.forFeature(['BpaZone', 'BpaProvider', 'BpaReport'])],
  providers: [BpaReportService, BpaProviderService, BpaZoneService],
  controllers: [AdminBpaZoneController, AdminBpaProviderController, AdminBpaReportController],
  exports: [BpaReportService],
})
export class BpaModule {}

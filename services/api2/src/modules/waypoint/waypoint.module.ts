import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AdminWaypointTypeController } from './controllers/admin/admin.waypoint-type.controller';
import { AdminWaypointController } from './controllers/admin/admin.waypoint.controller';
import { WaypointTypeService } from './services/waypoint-type.service';
import { WaypointService } from './services/waypoint.service';

@Module({
  imports: [DatabaseModule.forFeature(['Waypoint', 'WaypointType'])],
  controllers: [AdminWaypointController, AdminWaypointTypeController],
  providers: [WaypointService, WaypointTypeService],
  exports: [WaypointService, WaypointTypeService],
})
export class WaypointModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { WaypointService } from './services/waypoint.service';

@Module({
  imports: [DatabaseModule.forFeature(['Waypoint'])],
  providers: [WaypointService],
  exports: [WaypointService],
})
export class WaypointModule {}

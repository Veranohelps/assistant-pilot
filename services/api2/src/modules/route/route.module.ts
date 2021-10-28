import { forwardRef, Module } from '@nestjs/common';
import { MeteoblueService } from '../common/services/meteoblue.service';
import { DatabaseModule } from '../database/database.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { WaypointModule } from '../waypoint/waypoint.module';
import { AdminActivityTypeController } from './controllers/admin/admin.activity-type.controller';
import { AdminRouteController } from './controllers/admin/admin.route.controller';
import { PersonalRouteController } from './controllers/personal/personal.route.controller';
import { ActivityTypeService } from './services/activity-type.service';
import { RouteOriginService } from './services/route-origin.service';
import { RouteService } from './services/route.service';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [
    DatabaseModule.forFeature(['Route', 'RouteOrigin', 'ActivityType']),
    WaypointModule,
    forwardRef(() => ExpeditionModule),
  ],
  providers: [
    RouteService,
    RouteOriginService,
    WeatherService,
    MeteoblueService,
    ActivityTypeService,
  ],
  exports: [RouteService, RouteOriginService, ActivityTypeService],
  controllers: [AdminRouteController, PersonalRouteController, AdminActivityTypeController],
})
export class RouteModule {}

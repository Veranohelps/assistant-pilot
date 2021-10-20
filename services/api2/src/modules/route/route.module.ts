import { forwardRef, Module } from '@nestjs/common';
import { MeteoblueService } from '../common/services/meteoblue.service';
import { DatabaseModule } from '../database/database.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { WaypointModule } from '../waypoint/waypoint.module';
import { AdminRouteController } from './controllers/admin/admin.route.controller';
import { PersonalRouteController } from './controllers/personal/personal.route.controller';
import { RouteOriginService } from './services/route-origin.service';
import { RouteService } from './services/route.service';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [
    DatabaseModule.forFeature(['Route', 'RouteOrigin']),
    WaypointModule,
    forwardRef(() => ExpeditionModule),
  ],
  providers: [RouteService, RouteOriginService, WeatherService, MeteoblueService],
  exports: [RouteService, RouteOriginService],
  controllers: [AdminRouteController, PersonalRouteController],
})
export class RouteModule {}

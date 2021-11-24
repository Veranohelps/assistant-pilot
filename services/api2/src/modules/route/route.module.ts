import { forwardRef, Module } from '@nestjs/common';
import { ElevationService } from '../common/services/elevation.service';
import { TimezoneService } from '../common/services/timezone.service';
import { DatabaseModule } from '../database/database.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { SkillModule } from '../skill/skill.module';
import { WaypointModule } from '../waypoint/waypoint.module';
import { MeteoblueService } from '../weather/services/meteoblue.service';
import { OpenWeatherService } from '../weather/services/openweather.service';
import { WeatherService } from '../weather/services/weather.service';
import { AdminActivityTypeController } from './controllers/admin/admin.activity-type.controller';
import { AdminRouteController } from './controllers/admin/admin.route.controller';
import { PersonalRouteController } from './controllers/personal/personal.route.controller';
import { RouteEventHandler } from './events/event-handlers/route.event-handler';
import { ActivityTypeService } from './services/activity-type.service';
import { RouteActivityTypeService } from './services/route-activity-type.service';
import { RouteOriginService } from './services/route-origin.service';
import { RouteService } from './services/route.service';

@Module({
  imports: [
    DatabaseModule.forFeature(['Route', 'RouteOrigin', 'ActivityType', 'RouteActivityType']),
    WaypointModule,
    forwardRef(() => ExpeditionModule),
    SkillModule,
  ],
  providers: [
    RouteService,
    RouteOriginService,
    WeatherService,
    MeteoblueService,
    OpenWeatherService,
    ActivityTypeService,
    RouteActivityTypeService,
    TimezoneService,
    ElevationService,

    // event handlers
    RouteEventHandler,
  ],
  exports: [RouteService, RouteOriginService, ActivityTypeService, RouteActivityTypeService],
  controllers: [AdminRouteController, PersonalRouteController, AdminActivityTypeController],
})
export class RouteModule {}

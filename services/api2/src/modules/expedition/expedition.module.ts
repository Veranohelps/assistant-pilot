import { Module } from '@nestjs/common';
import { MeteoblueService } from '../weather/services/meteoblue.service';
import { DatabaseModule } from '../database/database.module';
import { RouteModule } from '../route/route.module';
import { WaypointModule } from '../waypoint/waypoint.module';
import { WeatherService } from '../weather/services/weather.service';
import { AdminExpeditionController } from './controllers/admin/admin.expedition.controller';
import { PersonalExpeditionController } from './controllers/personal/personal.expedition.controller';
import { ExpeditionResolver } from './graphql/resolvers/expedition.resolver';
import { ExpeditionRouteService } from './services/expedition-route.service';
import { ExpeditionService } from './services/expedition.service';

@Module({
  imports: [
    DatabaseModule.forFeature(['Expedition', 'ExpeditionRoute']),
    WaypointModule,
    RouteModule,
  ],
  controllers: [AdminExpeditionController, PersonalExpeditionController],
  providers: [
    ExpeditionService,
    ExpeditionRouteService,
    ExpeditionResolver,
    WeatherService,
    MeteoblueService,
  ],
  exports: [ExpeditionService, ExpeditionRouteService, WeatherService, MeteoblueService],
})
export class ExpeditionModule {}

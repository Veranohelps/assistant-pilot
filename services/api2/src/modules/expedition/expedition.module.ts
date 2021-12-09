import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RouteModule } from '../route/route.module';
import { UserModule } from '../user/user.module';
import { WaypointModule } from '../waypoint/waypoint.module';
import { WeatherModule } from '../weather/weather.module';
import { AdminExpeditionController } from './controllers/admin/admin.expedition.controller';
import { PersonalExpeditionUserController } from './controllers/personal/personal.expedition-user.controller';
import { PersonalExpeditionController } from './controllers/personal/personal.expedition.controller';
import { ExpeditionEventHandler } from './events/event-handlers/expedition.event-handler';
import { ExpeditionResolver } from './graphql/resolvers/expedition.resolver';
import { ExpeditionRouteService } from './services/expedition-route.service';
import { ExpeditionUserService } from './services/expedition-user.service';
import { ExpeditionService } from './services/expedition.service';

@Module({
  imports: [
    DatabaseModule.forFeature(['Expedition', 'ExpeditionRoute', 'ExpeditionUser']),
    WaypointModule,
    RouteModule,
    UserModule,
    WeatherModule,
  ],
  controllers: [
    AdminExpeditionController,
    PersonalExpeditionUserController,
    PersonalExpeditionController,
  ],
  providers: [
    ExpeditionService,
    ExpeditionRouteService,
    ExpeditionUserService,
    ExpeditionResolver,

    // event handlers
    ExpeditionEventHandler,
  ],
  exports: [ExpeditionService, ExpeditionRouteService, ExpeditionUserService],
})
export class ExpeditionModule {}

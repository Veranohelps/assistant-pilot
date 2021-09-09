import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RouteModule } from '../route/route.module';
import { WaypointModule } from '../waypoint/waypoint.module';
import { AdminExpeditionController } from './controllers/admin/admin.expedition.controller';
import { PersonalExpeditionController } from './controllers/personal/personal.expedition.controller';
import { ExpeditionResolver } from './graphql/resolvers/expedition.resolver';
import { ExpeditionRouteService } from './services/expedition-route.service';
import { ExpeditionWaypointService } from './services/expedition-waypoint.service';
import { ExpeditionService } from './services/expedition.service';

@Module({
  imports: [
    DatabaseModule.forFeature(['Expedition', 'ExpeditionRoute', 'ExpeditionWaypoint']),
    WaypointModule,
    RouteModule,
  ],
  providers: [
    ExpeditionService,
    ExpeditionWaypointService,
    ExpeditionRouteService,
    ExpeditionResolver,
  ],
  controllers: [AdminExpeditionController, PersonalExpeditionController],
})
export class ExpeditionModule {}

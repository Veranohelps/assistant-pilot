import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AdminRouteController } from './controllers/admin/admin.route.controller';
import { PersonalRouteController } from './controllers/personal/personal.route.controller';
import { RouteOriginService } from './services/route-origin.service';
import { RouteService } from './services/route.service';

@Module({
  imports: [DatabaseModule.forFeature(['Route', 'RouteOrigin'])],
  providers: [RouteService, RouteOriginService],
  exports: [RouteService, RouteOriginService],
  controllers: [AdminRouteController, PersonalRouteController],
})
export class RouteModule {}

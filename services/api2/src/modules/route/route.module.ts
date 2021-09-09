import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AdminRouteController } from './controllers/admin/admin.route.controller';
import { PersonalRouteController } from './controllers/personal/personal.route.controller';
import { RouteService } from './services/route.service';

@Module({
  imports: [DatabaseModule.forFeature(['Route'])],
  providers: [RouteService],
  exports: [RouteService],
  controllers: [AdminRouteController, PersonalRouteController],
})
export class RouteModule {}

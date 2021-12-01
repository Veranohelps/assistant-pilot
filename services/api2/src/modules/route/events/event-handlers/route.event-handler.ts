import { Injectable } from '@nestjs/common';
import { OnAppEvent } from '../../../common/decorators/event.decorator';
import {
  EExpeditionEvents,
  ICreateExpeditionEvent,
  IDeleteExpeditionsEvent,
} from '../../../expedition/events/event-types/expedition.event-type';
import { EUserEvents, IDeleteUserEvent } from '../../../user/events/event-types/user.event-type';
import { RouteActivityTypeService } from '../../services/route-activity-type.service';
import { RouteService } from '../../services/route.service';
import { ERouteEvents, IDeleteRoutesEvent } from '../event-types/route.event-type';

@Injectable()
export class RouteEventHandler {
  constructor(
    private routeService: RouteService,
    private routeActivityTypeService: RouteActivityTypeService,
  ) {}

  @OnAppEvent(EUserEvents.DELETE_USER)
  async onDeleteUser(event: IDeleteUserEvent) {
    await this.routeService.deleteUserRoutes(event.tx, event.user.id);
  }

  @OnAppEvent(EExpeditionEvents.CREATE_EXPEDITION)
  async onCreateExpedition(event: ICreateExpeditionEvent) {
    await this.routeService.updateExpeditionCount(event.tx, event.expedition.routeIds, 1);
  }

  @OnAppEvent(EExpeditionEvents.DELETE_EXPEDITIONS)
  async onDeleteExpedition(event: IDeleteExpeditionsEvent) {
    await this.routeService.updateExpeditionCount(
      event.tx,
      event.expeditions.map((e) => e.routeIds).flat(),
      -1,
    );
  }

  @OnAppEvent(ERouteEvents.DELETE_ROUTES)
  async onDeleteRoute(event: IDeleteRoutesEvent) {
    const ids = event.routes.map((r) => r.id);

    await this.routeActivityTypeService.deleteRoutesActivities(event.tx, ids);
  }
}

import { Injectable } from '@nestjs/common';
import { OnAppEvent } from '../../../common/decorators/event.decorator';
import {
  ERouteEvents,
  IDeleteRoutesEvent,
  IUpdateRoutesEvent,
} from '../../../route/events/event-types/route.event-type';
import { EUserEvents, IDeleteUserEvent } from '../../../user/events/event-types/user.event-type';
import { ExpeditionService } from '../../services/expedition.service';

@Injectable()
export class ExpeditionEventHandler {
  constructor(private expeditionService: ExpeditionService) {}

  @OnAppEvent(EUserEvents.DELETE_USER)
  async onUserDelete(event: IDeleteUserEvent) {
    await this.expeditionService.deleteUserExpeditions(event.tx, event.user.id);
  }

  @OnAppEvent(ERouteEvents.DELETE_ROUTES)
  async onRoutesDelete(event: IDeleteRoutesEvent) {
    await this.expeditionService.deleteRoutesFromExpeditions(
      event.tx,
      event.routes.map((r) => r.id),
    );
  }

  @OnAppEvent(ERouteEvents.UPDATE_ROUTES)
  async onUpdateRoute(event: IUpdateRoutesEvent) {
    await this.expeditionService.updateRouteExpeditions(
      event.tx,
      event.routes.map((r) => r.id),
    );
  }
}

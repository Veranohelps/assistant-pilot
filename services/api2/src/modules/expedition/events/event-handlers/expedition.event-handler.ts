import { Injectable } from '@nestjs/common';
import { OnAppEvent } from '../../../common/decorators/event.decorator';
import {
  ERouteEvents,
  IDeleteRoutesEvent,
  IUpdateRoutesEvent,
} from '../../../route/events/event-types/route.event-type';
import { EUserEvents, IDeleteUserEvent } from '../../../user/events/event-types/user.event-type';
import { ExpeditionRouteService } from '../../services/expedition-route.service';
import { ExpeditionUserService } from '../../services/expedition-user.service';
import { ExpeditionService } from '../../services/expedition.service';
import { EExpeditionEvents, IDeleteExpeditionsEvent } from '../event-types/expedition.event-type';

@Injectable()
export class ExpeditionEventHandler {
  constructor(
    private expeditionService: ExpeditionService,
    private expeditionRouteService: ExpeditionRouteService,
    private expeditionUserService: ExpeditionUserService,
  ) {}

  @OnAppEvent(EExpeditionEvents.DELETE_EXPEDITIONS)
  async onExpeditionDelete(event: IDeleteExpeditionsEvent) {
    const ids = event.expeditions.map((e) => e.id);

    await this.expeditionRouteService.deleteByExpeditions(event.tx, ids);
    await this.expeditionUserService.deleteExpeditionInvites(event.tx, ids);
  }

  @OnAppEvent(EUserEvents.DELETE_USER)
  async onUserDelete(event: IDeleteUserEvent) {
    await this.expeditionUserService.deleteUserInvites(event.tx, event.user.id);
    await this.expeditionService.deleteUserExpeditions(event.tx, event.user.id);
  }

  @OnAppEvent(ERouteEvents.DELETE_ROUTES)
  async onRoutesDelete(event: IDeleteRoutesEvent) {
    const ids = event.routes.map((r) => r.id);

    await this.expeditionRouteService.deleteByRoutes(event.tx, ids);
    await this.expeditionService.deleteRoutesFromExpeditions(event.tx, ids);
  }

  @OnAppEvent(ERouteEvents.UPDATE_ROUTES)
  async onUpdateRoute(event: IUpdateRoutesEvent) {
    await this.expeditionService.updateRouteExpeditions(
      event.tx,
      event.routes.map((r) => r.id),
    );
  }
}

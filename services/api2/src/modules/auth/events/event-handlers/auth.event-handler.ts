import { Injectable } from '@nestjs/common';
import { OnAppEvent } from '../../../common/decorators/event.decorator';
import { EUserEvents, IDeleteUserEvent } from '../../../user/events/event-types/user.event-type';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEventHandler {
  constructor(private authService: AuthService) {}

  @OnAppEvent(EUserEvents.DELETE_USER)
  async onUserDelete(event: IDeleteUserEvent) {
    await this.authService.deleteUser(event.user.auth0Id);
  }
}

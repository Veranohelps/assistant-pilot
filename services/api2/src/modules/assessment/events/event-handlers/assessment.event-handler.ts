import { Injectable } from '@nestjs/common';
import { OnAppEvent } from '../../../common/decorators/event.decorator';
import { EUserEvents, IDeleteUserEvent } from '../../../user/events/event-types/user.event-type';
import { AssessmentService } from '../../services/assessment.service';

@Injectable()
export class AssessmentEventHandler {
  constructor(private assessmentService: AssessmentService) {}

  @OnAppEvent(EUserEvents.DELETE_USER)
  async onUserDelete(event: IDeleteUserEvent) {
    await this.assessmentService.deleteUserAssessments(event.tx, event.user.id);
  }
}

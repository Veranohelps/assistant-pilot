import { Controller, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/personal-jwt-protected.decorator';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { IUser } from '../../../user/types/user.type';
import {
  expeditionUserEventDTOVSchema,
  expeditionUserEventVSchema,
  inviteUsersToExpeditionVSchema,
  startExpeditionUserEventVSchema,
} from '../../expedition.validation';
import { ExpeditionUserEventService } from '../../services/expedition-event.service';
import { ExpeditionUserRouteLogService } from '../../services/expedition-user-route-log.service';
import { ExpeditionUserService } from '../../services/expedition-user.service';
import {
  IExpeditionUserEventData,
  IExpeditionUserEventDTO,
} from '../../types/expedition-event.type';
import { IInviteUsersToExpeditionDTO } from '../../types/expedition-user.type';

@Controller('personal/expedition/:expeditionId/user')
@JwtProtected()
export class PersonalExpeditionUserController {
  constructor(
    private expeditionUserService: ExpeditionUserService,
    private expeditionLogService: ExpeditionUserRouteLogService,
    private expeditionUserEventService: ExpeditionUserEventService,
  ) {}

  @Patch('accept')
  @HttpCode(HttpStatus.OK)
  async accept(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') expeditionId: string,
  ) {
    const invite = await this.expeditionUserService.acceptInvite(tx, expeditionId, user.id);

    return successResponse('Invitation accepted', { invite });
  }

  @Patch('reject')
  @HttpCode(HttpStatus.OK)
  async reject(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') expeditionId: string,
  ) {
    const invite = await this.expeditionUserService.rejectInvite(tx, expeditionId, user.id);

    return successResponse('Invitation rejected', { invite });
  }

  @Patch('exit')
  @HttpCode(HttpStatus.OK)
  async exit(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') expeditionId: string,
  ) {
    const invite = await this.expeditionUserService.leaveExpedition(tx, expeditionId, user.id);

    return successResponse('You have been removed from this expedition', { invite });
  }

  @Post('invite')
  @HttpCode(HttpStatus.CREATED)
  async inviteUsers(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') expeditionId: string,
    @ParsedBody(inviteUsersToExpeditionVSchema) payload: IInviteUsersToExpeditionDTO,
  ) {
    const invites = await this.expeditionUserService.inviteUsers(
      tx,
      expeditionId,
      user.id,
      payload.invites,
    );

    return successResponse('Users invited to expedition', { invites });
  }

  @Patch('start')
  @HttpCode(HttpStatus.OK)
  async start(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') expeditionId: string,
    @ParsedBody(startExpeditionUserEventVSchema) payload: IExpeditionUserEventData,
  ) {
    const start = await this.expeditionUserService.startExpedition(
      tx,
      expeditionId,
      user.id,
      payload,
    );

    return successResponse('Expedition started', { start });
  }

  @Post('finish')
  @HttpCode(HttpStatus.OK)
  async finish(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') expeditionId: string,
    @ParsedBody(expeditionUserEventDTOVSchema) payload: IExpeditionUserEventDTO,
  ) {
    const expedition = await this.expeditionLogService.createExpeditionLog(
      tx,
      user.id,
      expeditionId,
      payload.data,
    );
    return successResponse('Expedition finished', { expedition });
  }

  @Patch('ping')
  @HttpCode(HttpStatus.OK)
  async ping(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') expeditionId: string,
    @ParsedBody(expeditionUserEventVSchema) payload: IExpeditionUserEventData,
  ) {
    //First of all, validate the userId have this expeditionId
    await this.expeditionUserService.getExpeditionUser(tx, expeditionId, user.id);

    const [pingEvent] = await this.expeditionUserEventService.insertArrayOfEvents(
      tx,
      expeditionId,
      user.id,
      [payload],
    );

    return successResponse('Ping to expedition', { pingEvent });
  }
  @Post('events')
  @HttpCode(HttpStatus.OK)
  async insertEvents(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @Param('expeditionId') expeditionId: string,
    @ParsedBody(expeditionUserEventDTOVSchema) payload: IExpeditionUserEventDTO,
  ) {
    const expeditionEvents = await this.expeditionUserEventService.insertArrayOfEvents(
      tx,
      expeditionId,
      user.id,
      payload.data,
    );
    return successResponse('Array of events inserted', { expeditionEvents });
  }
}

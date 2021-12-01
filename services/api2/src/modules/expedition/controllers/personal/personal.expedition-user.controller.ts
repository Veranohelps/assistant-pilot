import { Controller, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/personal-jwt-protected.decorator';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { IUser } from '../../../user/types/user.type';
import { inviteUsersToExpeditionVSchema } from '../../expedition.validation';
import { ExpeditionUserService } from '../../services/expedition-user.service';
import { IInviteUsersToExpeditionDTO } from '../../types/expedition-user.type';

@Controller('personal/expedition/:expeditionId/user')
@JwtProtected()
export class PersonalExpeditionUserController {
  constructor(private expeditionUserService: ExpeditionUserService) {}

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
}

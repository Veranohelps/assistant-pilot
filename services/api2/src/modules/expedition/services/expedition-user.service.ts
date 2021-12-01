import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../common/errors/http.error';
import AddFields from '../../common/utilities/add-fields';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { UserService } from '../../user/services/user.service';
import {
  EExpeditionInviteStatus,
  ICreateExpeditionUser,
  IExpeditionUser,
  IExpeditionUserFull,
} from '../types/expedition-user.type';
import { IExpedition } from '../types/expedition.type';
import { ExpeditionService } from './expedition.service';

@Injectable()
export class ExpeditionUserService {
  constructor(
    @InjectKnexClient('ExpeditionUser')
    private expeditionUserDb: KnexClient<'ExpeditionUser'>,
    @Inject(forwardRef(() => ExpeditionService))
    private expeditionService: ExpeditionService,
    private userService: UserService,
  ) {}

  async addUsers(
    tx: TransactionManager,
    expedition: IExpedition,
    invites: string[],
  ): Promise<IExpeditionUser[]> {
    const inserts: ICreateExpeditionUser[] = invites
      .filter((invite) => expedition.userId !== invite)
      .map<ICreateExpeditionUser>((userId) => ({
        expeditionId: expedition.id,
        userId,
        inviteStatus: EExpeditionInviteStatus.PENDING,
        isOwner: false,
      }));

    if (expedition.userId) {
      inserts.push({
        expeditionId: expedition.id,
        userId: expedition.userId,
        inviteStatus: EExpeditionInviteStatus.ACCEPTED,
        isOwner: true,
        acceptedOn: new Date(),
      });
    }

    const expUsers = await this.expeditionUserDb.write(tx).insert(inserts).cReturning();

    return expUsers;
  }

  async updateUsers(
    tx: TransactionManager,
    expedition: IExpedition,
    users: string[] | null,
    invites: string[] | null,
  ): Promise<IExpeditionUser[]> {
    // delete users not included in the updated list
    // except the expedition owner of course
    if (users?.length) {
      await this.expeditionUserDb
        .write(tx)
        .where({ isOwner: false, expeditionId: expedition.id })
        .whereNotIn('userId', users)
        .del();
    } else if (users?.length === 0) {
      await this.expeditionUserDb
        .write(tx)
        .where({ isOwner: false, expeditionId: expedition.id })
        .del();
    }

    if (invites?.length) {
      const inserts: ICreateExpeditionUser[] = invites.map<ICreateExpeditionUser>((userId) => ({
        expeditionId: expedition.id,
        userId,
        inviteStatus: EExpeditionInviteStatus.PENDING,
        isOwner: false,
      }));

      await this.expeditionUserDb
        .write(tx)
        .insert(inserts)
        .onConflict(['userId', 'expeditionId'])
        .merge()
        .where((b) =>
          b
            .where('ExpeditionUser.inviteStatus', EExpeditionInviteStatus.REJECTED)
            .orWhere('ExpeditionUser.inviteStatus', EExpeditionInviteStatus.PENDING),
        );
    }

    const currentUsers = await this.expeditionUserDb
      .read(tx)
      .where({ expeditionId: expedition.id });

    return currentUsers;
  }

  async inviteUsers(
    tx: TransactionManager,
    expeditionId: string,
    userId: string,
    invites: string[],
  ): Promise<IExpeditionUser[]> {
    const expUser = await this.getExpeditionUser(tx, expeditionId, userId);

    if (!expUser.isOwner) {
      throw new UnauthorizedError(
        ErrorCodes.UNAUTHORIZED,
        'You are not authorized to invite people to this expedition',
      );
    }

    // delete existing rejected or "left" invites
    await this.expeditionUserDb
      .write(tx)
      .where({ expeditionId })
      .whereIn('userId', invites)
      .where((b) =>
        b
          .where('inviteStatus', EExpeditionInviteStatus.REJECTED)
          .orWhere('inviteStatus', EExpeditionInviteStatus.LEFT),
      )
      .del();

    // if an invite wasn't deleted in the previous step, it means
    // it is either "PENDING" or "ACCEPTED". In such cases, this
    // operation is a no-op and basically just returns the existing invite
    const expUsers = await this.expeditionUserDb
      .write(tx)
      .insert(
        invites.map<ICreateExpeditionUser>((userId) => ({
          expeditionId,
          userId,
          isOwner: false,
          inviteStatus: EExpeditionInviteStatus.PENDING,
        })),
      )
      .onConflict(['expeditionId', 'userId'])
      .merge(['expeditionId'] as any[])
      .cReturning();

    return expUsers;
  }

  async acceptInvite(
    tx: TransactionManager,
    expeditionId: string,
    userId: string,
  ): Promise<IExpeditionUser> {
    let expUser = await this.getExpeditionUser(tx, expeditionId, userId);

    if (expUser.inviteStatus !== EExpeditionInviteStatus.PENDING) {
      throw new BadRequestError(
        ErrorCodes.INVALID_EXPEDITION_INVITE_STATUS,
        'You have already responded to this invitation',
      );
    }

    [expUser] = await this.expeditionUserDb
      .write(tx)
      .update({ inviteStatus: EExpeditionInviteStatus.ACCEPTED, acceptedOn: new Date() })
      .where({ expeditionId, userId })
      .cReturning();

    return expUser;
  }

  async rejectInvite(
    tx: TransactionManager,
    expeditionId: string,
    userId: string,
  ): Promise<IExpeditionUser> {
    let expUser = await this.getExpeditionUser(tx, expeditionId, userId);

    if (expUser.inviteStatus !== EExpeditionInviteStatus.PENDING) {
      throw new BadRequestError(
        ErrorCodes.INVALID_EXPEDITION_INVITE_STATUS,
        'You have already responded to this invitation',
      );
    }

    [expUser] = await this.expeditionUserDb
      .write(tx)
      .update({ inviteStatus: EExpeditionInviteStatus.REJECTED, rejectedOn: new Date() })
      .where({ expeditionId, userId })
      .cReturning();

    return expUser;
  }

  async leaveExpedition(
    tx: TransactionManager,
    expeditionId: string,
    userId: string,
  ): Promise<IExpeditionUser> {
    let expUser = await this.getExpeditionUser(tx, expeditionId, userId);

    if (expUser.inviteStatus !== EExpeditionInviteStatus.ACCEPTED) {
      throw new BadRequestError(
        ErrorCodes.INVALID_EXPEDITION_INVITE_STATUS,
        'You can only leave an expedition you have have joined',
      );
    }

    [expUser] = await this.expeditionUserDb
      .write(tx)
      .update({ inviteStatus: EExpeditionInviteStatus.REJECTED, leftOn: new Date() })
      .where({ expeditionId, userId })
      .cReturning();

    return expUser;
  }

  async deleteUserInvites(tx: TransactionManager, userId: string): Promise<IExpeditionUser[]> {
    const deleted = await this.expeditionUserDb.write(tx).where({ userId }).del().cReturning();

    return deleted;
  }

  async deleteExpeditionInvites(
    tx: TransactionManager,
    expeditionIds: string[],
  ): Promise<IExpeditionUser[]> {
    const deleted = await this.expeditionUserDb
      .write(tx)
      .whereIn('expeditionId', expeditionIds)
      .del()
      .cReturning();

    return deleted;
  }

  async getExpeditionUser(
    tx: TransactionManager | null,
    expeditionId: string,
    userId: string,
    options?: { inviteStatus?: EExpeditionInviteStatus[] },
  ): Promise<IExpeditionUser> {
    const builder = this.expeditionUserDb.read(tx).where({ expeditionId, userId }).first();

    if (options?.inviteStatus) {
      builder.whereIn('inviteStatus', options.inviteStatus);
    }

    const expUser = await builder;

    if (!expUser) {
      throw new NotFoundError(
        ErrorCodes.EXPEDITION_USER_NOT_FOUND,
        'You have not been added to this expedition or the expedition does not exist',
      );
    }

    return expUser;
  }

  async getUserInvites(
    userId: string,
    inviteStatus?: EExpeditionInviteStatus,
  ): Promise<IExpeditionUserFull[]> {
    const builder = this.expeditionUserDb.read(null).where({ userId });

    if (inviteStatus) {
      builder.where({ inviteStatus });
    }

    const result = await builder.then((res) =>
      AddFields.target(res).add(
        'expedition',
        () =>
          this.expeditionService.findByIds(
            null,
            res.map((eu) => eu.expeditionId),
          ),
        (eu, record) => record[eu.expeditionId],
      ),
    );

    return result;
  }

  async getExpeditionUsers(
    tx: TransactionManager | null,
    expeditionId: string,
    inviteStatus?: EExpeditionInviteStatus,
  ): Promise<IExpeditionUserFull[]> {
    const builder = this.expeditionUserDb.read(tx).where({ expeditionId });

    if (inviteStatus) {
      builder.where({ inviteStatus });
    }

    const result = await builder.then((res) =>
      AddFields.target(res).add(
        'user',
        () =>
          this.userService.findByIds(
            tx,
            res.map((eu) => eu.userId),
            { includeLevels: true },
          ),
        (eu, record) => record[eu.userId],
      ),
    );

    return result;
  }
}

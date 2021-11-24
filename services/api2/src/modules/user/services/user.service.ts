import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { EventService } from '../../common/services/event.service';
import { GcpService } from '../../common/services/gcp.service';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { EUserEvents } from '../events/event-types/user.event-type';
import {
  ICompleteUserRegistrationDTO,
  ICreateUserDTO,
  IEditedProfileDTO,
  IUser,
  IUserProfile,
} from '../types/user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectKnexClient('User')
    private db: KnexClient<'User'>,
    private eventService: EventService,
    private gcpService: GcpService,
  ) {}

  async signupUser(tx: TransactionManager, payload: ICreateUserDTO): Promise<IUser> {
    let [user] = await this.db
      .read(tx)
      .insert({ ...payload })
      .onConflict('auth0Id')
      .ignore()
      .cReturning();

    // if a user with with the provided Auth0Id already exists
    // we return the existing user
    user = user ? user : await this.findByAuth0Id(tx, payload.auth0Id);

    return user;
  }

  async completeRegistration(
    tx: TransactionManager,
    id: string,
    payload: ICompleteUserRegistrationDTO,
  ): Promise<IUser> {
    const [user] = await this.db
      .write(tx)
      .where({ id })
      .update({
        firstName: payload.firstName,
        lastName: payload.lastName,
        otherName: payload.otherName,
        isRegistrationFinished: true,
      })
      .cReturning();

    return user;
  }

  async findOne(tx: TransactionManager | null, id: string): Promise<IUser> {
    const user = await this.db.read(tx).where({ id }).first();

    if (!user) {
      throw new NotFoundError(ErrorCodes.USER_NOT_FOUND, 'User not found');
    }

    return user;
  }

  async findByAuth0Id(tx: TransactionManager | null, auth0Id: string): Promise<IUser> {
    const user = await this.db.read(tx).where({ auth0Id }).first();

    if (!user) {
      throw new NotFoundError(ErrorCodes.USER_NOT_FOUND, 'User not found');
    }

    return user;
  }

  async getProfile(tx: TransactionManager | null, id: string): Promise<IUserProfile> {
    const user = await this.findOne(tx, id);

    return { user };
  }
  async editedProfile(
    tx: TransactionManager,
    id: string,
    payload: IEditedProfileDTO,
  ): Promise<IUser> {
    const [user] = await this.db
      .write(tx)
      .where({ id })
      .update({
        firstName: payload.firstName,
        lastName: payload.lastName,
      })
      .cReturning();

    return user;
  }

  async updateAvatar(
    tx: TransactionManager,
    id: string,
    avatarFile: Express.Multer.File | null,
  ): Promise<IUser> {
    const user = await this.findOne(tx, id);

    if (user.avatar) {
      await this.gcpService.deleteAvatar(user.avatar);
    }

    const avatar = avatarFile ? await this.gcpService.uploadFile(avatarFile) : null;
    const [updatedUser] = await this.db.write(tx).where({ id }).update({ avatar }).cReturning();

    return updatedUser;
  }

  async deleteUser(tx: TransactionManager, userId: string): Promise<IUser> {
    const user = await this.findOne(tx, userId);

    await this.eventService.emitAsync(EUserEvents.DELETE_USER, { tx, user });
    await this.db.read(tx).where({ id: userId }).del();

    if (user.avatar) {
      await this.gcpService.deleteAvatar(user.avatar);
    }

    return user;
  }
}

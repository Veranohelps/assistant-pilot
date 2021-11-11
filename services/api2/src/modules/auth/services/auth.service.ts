import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';
import { NotFoundError } from '../../common/errors/http.error';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { UserService } from '../../user/services/user.service';
import { IUser } from '../../user/types/user.type';

@Injectable()
export class AuthService {
  private managementClient: ManagementClient;

  constructor(private userService: UserService, configService: ConfigService) {
    this.managementClient = new ManagementClient({
      domain: `${configService.get('AUTH0_TENANT')}.auth0.com`,
      clientId: configService.get('AUTH0_CLIENT_ID'),
      clientSecret: configService.get('AUTH0_CLIENT_SECRET'),
      scope: 'read:users delete:users',
    });
  }

  async registerUser(auth0Id: string): Promise<IUser> {
    const auth0User = await this.managementClient.getUser({ id: auth0Id });
    const tx = new TransactionManager();

    await tx.init();

    const user = await tx.knx.run(
      this.userService.signupUser(tx, {
        auth0Id,
        email: auth0User.email as string,
        firstName: auth0User.given_name,
        lastName: auth0User.family_name,
        avatar: auth0User.picture,
      }),
    );

    await this.managementClient.updateAppMetadata({ id: auth0Id }, { dersuId: user.id });

    return user;
  }

  async registerOrGetUser(auth0Id: string): Promise<IUser> {
    let user = await this.userService.findByAuth0Id(null, auth0Id).catch((e) => {
      if (e instanceof NotFoundError) {
        return null;
      }

      throw e;
    });

    if (!user) {
      user = await this.registerUser(auth0Id);
    }

    return user;
  }

  async deleteUser(tx: TransactionManager, id: string, auth0Id: string) {
    await this.userService.deleteUser(tx, id);
    await this.managementClient.deleteUser({ id: auth0Id });
  }
}

import { TestingModule } from '@nestjs/testing';
import { BootstrapTest } from '../../../../test/setup';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await BootstrapTest();
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return a user', async () => {
    const testUser = {
      email: 'e.test@test.com',
      auth0Id: 'auth0Id',
    };

    const tx = await TransactionManager.create();

    const user = await tx.run(service.signupUser(tx, testUser));

    expect(user.id).toBeDefined();
    expect(user).toEqual(expect.objectContaining(testUser));

    const createdUser = await service.findOne(null, user.id);

    expect(user).toEqual(expect.objectContaining(createdUser));
  });
});

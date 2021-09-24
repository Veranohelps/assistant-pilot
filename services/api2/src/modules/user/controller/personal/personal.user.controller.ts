import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/jwt-protected.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { joiPipe } from '../../../common/pipes/validation.pipe';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { UserService } from '../../services/user.service';
import { ICompleteUserRegistrationDTO, IUser } from '../../types/user.type';
import { completeUserRegistrationValidationSchema } from '../../user.validation-schema';

@Controller('personal/user')
@JwtProtected()
export class PersonalUserController {
  constructor(private userService: UserService) {}

  @Patch('complete-registration')
  @HttpCode(HttpStatus.CREATED)
  async completeRegistration(
    @Tx() tx: TransactionManager,
    @Body(joiPipe(completeUserRegistrationValidationSchema)) payload: ICompleteUserRegistrationDTO,
    @UserData() user: IUser,
  ) {
    const updatedUser = await this.userService.completeRegistration(tx, user.id, payload);

    return successResponse('User registration completed', { user: updatedUser });
  }

  @Get('profile')
  @HttpCode(HttpStatus.CREATED)
  async getProfile(@UserData() user: IUser) {
    const profile = { user };

    return successResponse('User signup success', { profile });
  }
}

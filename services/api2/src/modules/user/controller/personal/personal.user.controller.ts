import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { UserLevelService } from '../../../assessment/services/user-level.service';
import { JwtProtected } from '../../../auth/decorators/jwt-protected.decorator';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { GcpService } from '../../../common/services/gcp.service';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { UserService } from '../../services/user.service';
import { ICompleteUserRegistrationDTO, IEditedProfileDTO, IUser } from '../../types/user.type';
import {
  completeUserRegistrationValidationSchema,
  editedUserValidationSchema,
} from '../../user.validation-schema';

@Controller('personal/user')
@JwtProtected()
export class PersonalUserController {
  constructor(
    private userService: UserService,
    private userLevelService: UserLevelService,
    private gcpService: GcpService,
  ) {}

  @Patch('complete-registration')
  @HttpCode(HttpStatus.CREATED)
  async completeRegistration(
    @Tx() tx: TransactionManager,
    @ParsedBody(completeUserRegistrationValidationSchema) payload: ICompleteUserRegistrationDTO,
    @UserData() user: IUser,
  ) {
    const updatedUser = await this.userService.completeRegistration(tx, user.id, payload);

    return successResponse('User registration completed', { user: updatedUser });
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@UserData() user: IUser) {
    const currentLevels = await this.userLevelService.getCurrentUserLevels(null, user.id);
    const profile = { user, currentLevels };

    return successResponse('User signup success', { profile });
  }

  @Patch('edit-profile')
  @HttpCode(HttpStatus.CREATED)
  async editedProfile(
    @Tx() tx: TransactionManager,
    @ParsedBody(editedUserValidationSchema) payload: IEditedProfileDTO,
    @UserData() user: IUser,
  ) {
    const updatedUser = await this.userService.editedProfile(tx, user.id, payload);

    return successResponse('User profile edited success', { user: updatedUser });
  }

  @Patch('update-avatar')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Tx() tx: TransactionManager,
    @UserData() user: IUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userDataBase = await this.userService.findOne(tx, user.id);
    const currentAvatarUrl = userDataBase.avatar;
    const currentAvatarFileName = currentAvatarUrl ? path.basename(currentAvatarUrl) : null;

    if (
      currentAvatarUrl != null &&
      currentAvatarFileName != null &&
      this.gcpService.isGcpFile(currentAvatarUrl)
    ) {
      await this.gcpService.deleteFile(currentAvatarFileName);
    } else {
      console.info(
        `Current avatar is empty or not GCP, ignoring deletion from storage: ${currentAvatarUrl}`,
      );
    }

    const avatarUrl = await this.gcpService.uploadFile(file);
    const updatedUser = await this.userService.updateAvatar(tx, user.id, avatarUrl);

    return successResponse('Avatar updated success', { user: updatedUser });
  }

  @Delete('delete-avatar')
  @HttpCode(HttpStatus.OK)
  async deleteAvatar(@Tx() tx: TransactionManager, @UserData() user: IUser) {
    const userDataBase = await this.userService.findOne(tx, user.id);
    const currentAvatarUrl = userDataBase.avatar;
    const currentAvatarFileName = currentAvatarUrl ? path.basename(currentAvatarUrl) : null;

    if (
      currentAvatarUrl != null &&
      currentAvatarFileName != null &&
      this.gcpService.isGcpFile(currentAvatarUrl)
    ) {
      await this.gcpService.deleteFile(currentAvatarFileName);
    } else {
      console.info(
        `Current avatar is empty or not GCP, ignoring deletion from storage: ${currentAvatarUrl}`,
      );
    }

    const updatedUser = await this.userService.updateAvatar(tx, user.id, null);
    return successResponse('Avatar deleted success', { user: updatedUser });
  }
}

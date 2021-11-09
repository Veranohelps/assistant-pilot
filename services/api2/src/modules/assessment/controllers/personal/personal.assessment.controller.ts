import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { JwtProtected } from '../../../auth/decorators/personal-jwt-protected.decorator';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { UserData } from '../../../common/decorators/user-data.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { IUser } from '../../../user/types/user.type';
import { createAssessmentValidationSchema } from '../../assessment.validation-schema';
import { AssessmentService } from '../../services/assessment.service';
import { ICreateAssessmentDTO } from '../../types/assessment.type';

@Controller('personal/assessment')
@JwtProtected()
export class PersonalAssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  async submitAssessment(
    @Tx() tx: TransactionManager,
    @ParsedBody(createAssessmentValidationSchema) payload: ICreateAssessmentDTO,
    @UserData() user: IUser,
  ) {
    const result = await this.assessmentService.create(tx, user.id, payload);

    return successResponse('Assessment submitted', result);
  }
}

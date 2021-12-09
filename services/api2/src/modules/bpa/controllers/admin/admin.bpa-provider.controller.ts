import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { AdminJwtProtected } from '../../../auth/decorators/admin-jwt-atuh.guard';
import { ParsedBody } from '../../../common/decorators/parsed-body.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { successResponse } from '../../../common/utilities/success-response';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { createBpaProviderVSchema, updateBpaProviderVSchema } from '../../bpa.validation-schema';
import { BpaProviderService } from '../../services/bpa-provider.service';
import { ICreateBpaProvider } from '../../types/bpa-provider.type';

@Controller('admin/bpa/provider')
@AdminJwtProtected()
export class AdminBpaProviderController {
  constructor(private bpaProviderService: BpaProviderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProviders() {
    const providers = await this.bpaProviderService.providers();

    return successResponse('BPA providers', { providers });
  }

  @Get(':providerId')
  @HttpCode(HttpStatus.OK)
  async getProvider(@Param('providerId') id: string) {
    const provider = await this.bpaProviderService.findOne(null, id);

    return successResponse('BPA provider', { provider });
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Tx() tx: TransactionManager,
    @ParsedBody(createBpaProviderVSchema) payload: ICreateBpaProvider,
  ) {
    const provider = await this.bpaProviderService.create(tx, payload);

    return successResponse('BPA provider created', { provider });
  }

  @Patch(':providerId/update')
  @HttpCode(HttpStatus.OK)
  async update(
    @Tx() tx: TransactionManager,
    @ParsedBody(updateBpaProviderVSchema) payload: Partial<ICreateBpaProvider>,
    @Param('providerId') id: string,
  ) {
    const provider = await this.bpaProviderService.updateProvider(tx, id, payload);

    return successResponse('BPA provider updated', { provider });
  }

  @Patch(':providerId/disable')
  @HttpCode(HttpStatus.OK)
  async disable(@Tx() tx: TransactionManager, @Param('providerId') id: string) {
    const provider = await this.bpaProviderService.disable(tx, id);

    return successResponse('BPA provider disabled', { provider });
  }
}

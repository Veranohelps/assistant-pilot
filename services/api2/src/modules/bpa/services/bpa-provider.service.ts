import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { SRecord } from '../../../types/helpers.type';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { generateRecord2 } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IBpaProvider, ICreateBpaProvider } from '../types/bpa-provider.type';

@Injectable()
export class BpaProviderService {
  constructor(
    @InjectKnexClient('BpaProvider')
    private db: KnexClient<'BpaProvider'>,
  ) {}

  async create(tx: TransactionManager, payload: ICreateBpaProvider): Promise<IBpaProvider> {
    // TODO
    // BPA provider should have a timezone associated with them
    // see https://www.notion.so/BPA-reports-use-the-time-zone-of-the-user-that-created-them-e0a852ae04e14b9fa349a9dc8e237a18
    const [provider] = await this.db
      .write(tx)
      .insert({ name: payload.name, description: payload.description, url: payload.url })
      .cReturning();

    return provider;
  }

  async updateProvider(
    tx: TransactionManager,
    id: string,
    payload: Partial<ICreateBpaProvider>,
  ): Promise<IBpaProvider> {
    const [provider] = await this.db
      .write(tx)
      .where({ id })
      .update({ name: payload.name, description: payload.description })
      .cReturning();

    if (!provider) {
      throw new NotFoundError(ErrorCodes.BPA_PROVIDER_NOT_FOUND, 'BPA provider not found');
    }

    return provider;
  }

  async disable(tx: TransactionManager, id: string): Promise<IBpaProvider> {
    const [provider] = await this.db
      .write(tx)
      .update({ disabled: true })
      .where({ id })
      .cReturning();

    return provider;
  }

  async updateReportCount(
    tx: TransactionManager,
    id: string,
    delta: number,
  ): Promise<IBpaProvider> {
    const [provider] = await this.db
      .write(tx)
      .increment('reportCount', delta)
      .where({ id })
      .cReturning();

    return provider;
  }

  async findOne(tx: TransactionManager | null, id: string): Promise<IBpaProvider> {
    const provider = await this.db.read(tx).where({ id }).first();

    if (!provider) {
      throw new NotFoundError(ErrorCodes.BPA_PROVIDER_NOT_FOUND, 'BPA provider not found');
    }

    return provider;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<SRecord<IBpaProvider>> {
    const provider = await this.db
      .read(tx)
      .whereIn('id', _.uniq(ids))
      .then(generateRecord2((p) => p.id));

    return provider;
  }

  async providers(): Promise<IBpaProvider[]> {
    const providers = await this.db.read().orderBy('createdAt', 'desc');

    return providers;
  }
}

import { Injectable } from '@nestjs/common';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IRouteOrigin } from '../types/route-origin.type';

@Injectable()
export class RouteOriginService {
  constructor(
    @InjectKnexClient('RouteOrigin')
    private db: KnexClient<'RouteOrigin'>,
  ) {}

  async getAllOrigins(): Promise<IRouteOrigin[]> {
    const origins = await this.db.read();

    return origins;
  }
}

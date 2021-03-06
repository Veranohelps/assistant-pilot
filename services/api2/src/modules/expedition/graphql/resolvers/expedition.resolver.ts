import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AdminJwtProtected } from '../../../auth/decorators/admin-jwt-atuh.guard';
import { IRoute } from '../../../route/types/route.type';
import { ExpeditionRouteService } from '../../services/expedition-route.service';
import { ExpeditionService } from '../../services/expedition.service';
import { IExpedition } from '../../types/expedition.type';
import { ExpeditionModel } from '../models/expedition.model';

@Resolver(() => ExpeditionModel)
export class ExpeditionResolver {
  constructor(
    private expeditionService: ExpeditionService,
    private expeditionRouteService: ExpeditionRouteService,
  ) {}

  @Query(() => [ExpeditionModel])
  @AdminJwtProtected()
  async expeditions(): Promise<IExpedition[]> {
    const response = await this.expeditionService.getExpeditions();

    return response;
  }

  @ResolveField()
  async routes(@Parent() expedition: IExpedition): Promise<IRoute[]> {
    const routes = await this.expeditionRouteService.getRoutesLoader.load(expedition.id);

    return routes;
  }
}

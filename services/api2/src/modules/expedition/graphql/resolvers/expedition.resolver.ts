import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Writable } from 'stream';
import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';
import { Tx } from '../../../common/decorators/transaction-manager.decorator';
import { joiPipe } from '../../../common/pipes/validation.pipe';
import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { IRoute } from '../../../route/types/route.type';
import { IWaypoint } from '../../../waypoint/types/waypoint.type';
import { expeditionValidationSchema } from '../../expedition.validation';
import { ExpeditionRouteService } from '../../services/expedition-route.service';
import { ExpeditionWaypointService } from '../../services/expedition-waypoint.service';
import { ExpeditionService } from '../../services/expedition.service';
import { IExpedition } from '../../types/expedition.type';
import { CreateExpeditionInput, ExpeditionModel } from '../models/expedition.model';

@Resolver(() => ExpeditionModel)
export class ExpeditionResolver {
  constructor(
    private expeditionService: ExpeditionService,
    private expeditionRouteService: ExpeditionRouteService,
    private expeditionWaypointService: ExpeditionWaypointService,
  ) {}

  @Query(() => [ExpeditionModel])
  @ApiAdminTokenProtected()
  async expeditions(@Context() args: any): Promise<IExpedition[]> {
    const response = await this.expeditionService.getExpeditions();

    return response;
  }

  @ResolveField()
  async routes(@Parent() expedition: IExpedition): Promise<IRoute[]> {
    const routes = await this.expeditionRouteService.getRoutesLoader.load(expedition.id);

    return routes;
  }

  @ResolveField()
  async waypoints(@Parent() expedition: IExpedition): Promise<IWaypoint[]> {
    const waypoints = await this.expeditionWaypointService.getWaypointsLoader.load(expedition.id);

    return waypoints;
  }

  @Mutation(() => ExpeditionModel)
  @ApiAdminTokenProtected()
  async createExpedition(
    @Tx() tx: TransactionManager,
    @Args('data', joiPipe(expeditionValidationSchema, { stripUnknown: false }))
    data: CreateExpeditionInput,
    @Args({ name: 'gpxFile', type: () => GraphQLUpload }) gpxFile: FileUpload,
  ): Promise<IExpedition> {
    let gpxText = '';

    await new Promise((res, rej) => {
      gpxFile
        .createReadStream()
        .setEncoding('utf-8')
        .pipe(
          new Writable({
            write: (chunk: string, encoding, next) => {
              gpxText = `${gpxText}${chunk}`;

              next();
            },
          }),
        )
        .on('close', res)
        .on('error', rej);
    });

    const response = await this.expeditionService.createFromGeojson2(tx, data, gpxText);

    return response;
  }
}

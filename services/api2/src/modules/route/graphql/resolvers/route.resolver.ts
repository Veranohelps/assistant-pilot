// import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
// import { FileUpload, GraphQLUpload } from 'graphql-upload';
// import { Writable } from 'stream';
// import { ApiAdminTokenProtected } from '../../../auth/decorators/api-admin-token-protected.decorator';
// import { Tx } from '../../../common/decorators/transaction-manager.decorator';
// import { UserData } from '../../../common/decorators/user-data.decorator';
// import { joiPipe } from '../../../common/pipes/validation.pipe';
// import { AppQuery } from '../../../common/utilities/app-query';
// import { TransactionManager } from '../../../common/utilities/transaction-manager';
// import { IGetRoutesUrlParameters, IRoute } from '../../../route/types/route.type';
// import { IUser } from '../../../user/types/user.type';
// import { IWaypoint } from '../../../waypoint/types/waypoint.type';
// import { expeditionFromGpxValidationSchema } from '../../expedition.validation';
// import { createRouteValidationSchema } from '../../route.validation-schema';
// import { ExpeditionRouteService } from '../../services/expedition-route.service';
// import { ExpeditionWaypointService } from '../../services/expedition-waypoint.service';
// import { ExpeditionService } from '../../services/expedition.service';
// import { RouteService } from '../../services/route.service';
// import { IExpedition } from '../../types/expedition.type';
// import { CreateExpeditionInput, ExpeditionModel } from '../models/expedition.model';
// import { CreateRouteInput, RouteModel } from '../models/route.model';

// @Resolver(() => RouteModel)
// export class ExpeditionResolver {
//   constructor(private routeService: RouteService) {}

//   @Query(() => [RouteModel])
//   @ApiAdminTokenProtected()
//   async expeditions(): Promise<IExpedition[]> {
//     const response = await this.expeditionService.getExpeditions();

//     return response;
//   }

//   @ResolveField()
//   async routes(@UserData() user: IUser): Promise<IRoute[]> {
//     const routes = await this.routeService.getUserRoutes(
//       null,
//       user.id,
//       new AppQuery<IGetRoutesUrlParameters>({ owner: ['me'] }),
//     );

//     return routes;
//   }

//   @ResolveField()
//   async waypoints(@Parent() expedition: IExpedition): Promise<IWaypoint[]> {
//     const waypoints = await this.expeditionWaypointService.getWaypointsLoader.load(expedition.id);

//     return waypoints;
//   }

//   @Mutation(() => ExpeditionModel)
//   @ApiAdminTokenProtected()
//   async createRoute(
//     @Tx() tx: TransactionManager,
//     @Args('data', joiPipe(createRouteValidationSchema))
//     data: CreateRouteInput,
//     @Args({ name: 'gpxFile', type: () => GraphQLUpload }) gpxFile: FileUpload,
//   ): Promise<IExpedition> {
//     let gpxText = '';

//     await new Promise((res, rej) => {
//       gpxFile
//         .createReadStream()
//         .setEncoding('utf-8')
//         .pipe(
//           new Writable({
//             write: (chunk: string, encoding, next) => {
//               gpxText = `${gpxText}${chunk}`;

//               next();
//             },
//           }),
//         )
//         .on('close', res)
//         .on('error', rej);
//     });

//     const response = await this.expeditionService.createFromGeojson2(tx, data, gpxText);

//     return response;
//   }
// }

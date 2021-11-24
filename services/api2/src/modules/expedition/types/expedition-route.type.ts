import { IDefaultMeta } from '../../database/types/database.type';
import { TEstimatedTimeToMPI } from '../../route/types/route-activity-type.type';
import { IRoute, IRouteFull, IRouteSlim } from '../../route/types/route.type';

export interface IExpeditionRoute {
  expeditionId: string;
  routeId: string;
  startDateTime: Date;
  activityTypeIds: string[];
  estimatedDurationInMinutes: number;
  estimatedDurationToMeteoPointsOfInterestsInMinutes: TEstimatedTimeToMPI[];
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExpeditionRouteFull extends IExpeditionRoute {
  route: IRouteFull;
}

export interface ICreateExpeditionRoute {
  expeditionId: string;
  routeId: string;
  startDateTime: Date;
  activityTypeIds: string[];
  estimatedDurationInMinutes: number;
  estimatedDurationToMeteoPointsOfInterestsInMinutes: TEstimatedTimeToMPI[];
  meta?: IDefaultMeta;
}

export interface ICreateExpeditionRoutesDTO {
  routes: {
    routeId: string;
    startDateTime: Date;
  }[];
}

export interface IExpeditionRouteWithRouteSlim extends IExpeditionRoute {
  route: IRouteSlim;
}

export interface IExpeditionRouteWithRoute extends IExpeditionRoute {
  route: IRoute;
}

export interface IExpeditionRouteParameters {
  durationInMinutes: number;
  expeditionId: string;
  activityTypeIds: string[];
}

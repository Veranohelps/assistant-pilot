import { ILineStringGeometry } from './geometry';
import { IBaseResponse } from './request';
import { IWaypoint } from './waypoint';

export interface IRoute {
  id: string;
  originId: string;
  activityTypeIds: string[];
  levelIds: string[];
  userId: string | null;
  name: string;
  description: string | null;
  coordinate?: ILineStringGeometry;
  updatedAt: string;
  url?: string;
}

export interface IGetRoutesResult extends IBaseResponse {
  data: {
    routes: IRoute[];
  };
}

export interface IGetRouteResult extends IBaseResponse {
  data: {
    route: IRoute;
  };
}

export interface ICreateRouteResult extends IBaseResponse {
  data: {
    route: IRoute;
    waypoints: IWaypoint[];
  };
}

export interface ICreateRoutePayload {
  name: string;
  description?: string | null;
  gpx: File;
  activityTypes: string[];
  levels: string[];
}

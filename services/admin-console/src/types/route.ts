import { ILineStringGeometry } from './geometry';
import { IWaypoint } from './waypoint';

export interface IRoute {
  id: string;
  originId: string;
  userId: string | null;
  name: string;
  coordinate?: ILineStringGeometry;
  updatedAt: string;
  url?: string;
}

export interface IGetRoutesResult {
  data: {
    routes: IRoute[];
  };
}

export interface ICreateRouteResult {
  data: {
    route: IRoute;
    waypoints: IWaypoint[];
  };
}

export interface ICreateExpeditionPayload {
  name: string;
  gpx: File;
}

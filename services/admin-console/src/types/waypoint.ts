import { IPointGeometry, IPolygonGeometry } from './geometry';
import { IBaseResponse } from './request';

export interface IWaypoint {
  id: string;
  typeIds: string[];
  name: string;
  description: string | null;
  radiusInMeters: number;
  coordinate: IPointGeometry;
  updatedAt: string;
}

export interface IGetWaypointsResponse extends IBaseResponse {
  data: {
    waypoints: IWaypoint[];
  };
}

export interface IGetWaypointResponse extends IBaseResponse {
  data: {
    waypoint: IWaypoint;
  };
}

export interface ICreateWaypointPayload {
  types: string[];
  name: string;
  description?: string;
  radiusInMeters: number;
  longitude: number;
  latitude: number;
  altitude: number;
}

export interface IBulkCreateWaypointResponse extends IBaseResponse {
  data: {
    boundingBox?: IPolygonGeometry;
    waypoints: IWaypoint[];
  };
}

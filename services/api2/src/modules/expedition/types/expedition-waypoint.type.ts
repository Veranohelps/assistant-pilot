import { IDefaultMeta } from '../../database/types/database.type';
import { IWaypoint } from '../../waypoint/types/waypoint.type';

export interface IExpeditionWaypoint {
  expeditionId: string;
  waypointId: string;
  meta: IDefaultMeta;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateExpeditionWaypoint {
  expeditionId: string;
  waypointId: string;
  meta?: IDefaultMeta;
}
export interface IExpeditionWaypointFull extends IExpeditionWaypoint {
  waypoints: IWaypoint[];
}

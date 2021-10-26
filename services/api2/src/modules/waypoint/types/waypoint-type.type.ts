export enum EWaypointTypeActivityType {
  ALL = 'all',
  SNOW = 'snow',
}

export enum EWaypointType3x3 {
  LOCAL = 'local',
  ZONAL = 'zonal',
  FEEDBACK = 'feedback',
}

export interface IWaypointType {
  id: string;
  name: string;
  activityType: EWaypointTypeActivityType;
  _3x3: EWaypointType3x3;
  description: string;
}

export interface ICreateWaypointType {
  id: string;
  name: string;
  activityType: EWaypointTypeActivityType;
  _3x3: EWaypointType3x3;
  description: string;
}

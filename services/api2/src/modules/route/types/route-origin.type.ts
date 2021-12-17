export enum ERouteOrigins {
  DERSU = 'dersu',
  GARMIN = 'garmin',
  STRAVA = 'strava',
  MANUAL = 'manual',
  EXPEDITION = 'expedition',
}

export interface IRouteOrigin {
  id: string;
  name: string;
  description: string;
}

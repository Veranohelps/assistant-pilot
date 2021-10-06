export enum ERouteOrigins {
  DERSU = 'dersu',
  GARMIN = 'garmin',
  STRAVA = 'strava',
  MANUAL = 'manual',
}

export interface IRouteOrigin {
  id: string;
  name: string;
  description: string;
}

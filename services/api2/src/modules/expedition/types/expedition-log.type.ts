export interface IExpeditionUserRouteLog {
  id: string;
  expeditionId: string;
  userId: string;
  routeIds: string[];
  actualRouteId: string | null;
  name: string;
  description: string;
  originId: string;
  visibility: string;
  averageSpeed: number;
  startDateTime: Date;
  endDateTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICreateExpeditionUserRouteLog {
  expeditionId: string;
  userId: string;
  actualRouteId?: string | null;
  routeIds: string[];
  name: string;
  description?: string | null;
  visibility: string;
  averageSpeed: number;
  startDateTime: Date;
  endDateTime: Date;
}
export enum EExpeditionLogOrigin {
  DERSU = 'dersu',
  GARMIN = 'garmin',
  STRAVA = 'strava',
  MANUAL = 'manual',
}

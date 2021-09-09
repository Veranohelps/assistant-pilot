import { IWaypoint } from './waypoint';

export interface IExpedition {
  id: string;
  name: string;
  description: string | null;
  longitude: number;
  latitude: number;
  altitude: number | null;
  startDate: Date;
  endDate: Date;
  meta: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IExpeditionFull extends IExpedition {
  routes: { id: string; url: string }[];
  waypoints: IWaypoint[];
}

export interface IGetExpeditionsResult {
  data: {
    expeditions: IExpeditionFull[];
  };
}

export interface IGetExpeditionResult {
  expedition: IExpeditionFull;
}

export interface ICreateExpeditionPayload {
  name: string;
  description?: string | null;
  longitude: number;
  latitude: number;
  altitude?: number | null;
  startDate: Date;
  endDate: Date;
}

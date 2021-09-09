export interface IWaypoint {
  id: string;
  type: string;
  name: string;
  description: string | null;
  radiusInMeters: number;
  longitude: number;
  latitude: number;
  altitude: number | null;
  meta: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

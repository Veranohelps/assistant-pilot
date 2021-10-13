import { IPointGeometry } from './geometry';

export interface IWaypoint {
  id: string;
  type: string;
  name: string;
  description: string | null;
  radiusInMeters: number;
  coordinate: IPointGeometry;
  updatedAt: string;
}

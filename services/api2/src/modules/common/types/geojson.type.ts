interface ICoordinateProperties {
  times: Date[];
}

interface IProperties {
  name: string;
  cmt: string;
  desc: string;
  time: Date;
  _gpxType: string;
  coordinateProperties: ICoordinateProperties;
}

export interface IPointGeometry {
  type: 'Point';
  coordinates: [number, number, number | null];
}

export interface ILineStringGeometry {
  type: 'LineString';
  coordinates: [number, number, number | null][];
}

export interface IMultiPointGeometry {
  type: 'MultiPoint';
  coordinates: [number, number, number | null][];
}

export type T2dPoint = [number, number];
export interface IPolygonGeometry {
  type: 'Polygon';
  coordinates: T2dPoint[][];
}

interface Feature {
  type: string;
  properties?: IProperties;
  geometry: IPointGeometry | ILineStringGeometry | IPolygonGeometry;
}

export interface IGeoJSON {
  type?: string;
  features: Feature[];
}

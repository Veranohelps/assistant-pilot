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

interface IGeometry {
  type: string;
  coordinates: [number, number, number | null][];
}

export interface IPointGeometry {
  type: 'Point';
  coordinates: [number, number, number | null];
}

export interface ILineStringGeometry {
  type: 'LineString';
  coordinates: [number, number, number | null][];
}

interface Feature {
  type: string;
  properties: IProperties;
  geometry: IPointGeometry | ILineStringGeometry;
}

export interface IGeoJSON {
  type: string;
  features: Feature[];
}

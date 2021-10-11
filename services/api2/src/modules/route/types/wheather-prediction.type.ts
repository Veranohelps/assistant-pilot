import { IPointGeometry } from '../../common/types/geojson.type';

export interface IGetRouteWeatherUrlParameters {
  dateTime: string;
}

export interface IPredictionCoordinates {
  coordinate: IPointGeometry;
}

export interface IWeatherPrediction {
  temperature: string;
  precipitation: string;
  visibility: string;
  windspeed: string;
  pictocode: string;
}
export interface IWeatherForecast {
  time: string;
  prediction: IWeatherPrediction;
}

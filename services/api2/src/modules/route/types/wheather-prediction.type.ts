import { IPointGeometry } from '../../common/types/geojson.type';

export interface IGetRouteWeatherUrlParameters {
  dateTime: string;
}

export interface IPredictionCoordinates {
  coordinate: IPointGeometry;
}

export interface IWeatherPrediction {
  dateTime: Date;
  sunriseDateTime: Date | null;
  sunsetDateTime: Date | null;
  ranges: IRange[];
}
export interface IRange {
  range: string;
  forecastHourly: IWeatherForecast[];
}
export interface IWeatherForecast {
  dateTime: Date;
  temperature: number;
  feltTemperature: number;
  precipitation: number;
  precipitationProbability: number;
  visibility: number;
  lowClouds: number;
  midClouds: number;
  hiClouds: number;
  totalCloudCover: number;
  sunshineTime: number;
  windSpeed: number;
  windGust: number;
  isDay: number;
  pictoCode: number;
}

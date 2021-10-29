import { IPointGeometry } from '../../common/types/geojson.type';

export interface IGetRouteWeatherUrlParameters {}

export interface IPredictionCoordinates {
  coordinate: IPointGeometry;
}

export interface IRangeHourly {
  range: string;
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
  isDay: boolean;
  pictoCode: number;
}
export interface IForecastHourly {
  dateTime: Date;
  ranges: IRangeHourly[];
}
export interface ISunCalendar {
  dateTime: string;
  sunriseDateTime: string;
  sunsetDateTime: string;
  moonriseDateTime: string;
  moonsetDatetime: string;
  moonPhaseName: string;
}
export interface IMeteograms {
  range: string;
  meteogram: string;
}
export interface IWeatherPredictionDaily {
  meteograms: IMeteograms[];
  sunCalendar: ISunCalendar[];
  forecastHourly: IForecastHourly[];
}

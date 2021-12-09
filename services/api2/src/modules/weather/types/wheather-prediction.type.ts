import { IBpaReport } from '../../bpa/types/bpa-report.type';

export interface IRangeHourly {
  range: string;
  temperature: number;
  feltTemperature: number;
  precipitation: number | null;
  precipitationProbability: number;
  visibility: number;
  lowClouds: number;
  midClouds: number;
  hiClouds: number;
  totalCloudCover: number | null;
  sunshineTime: number | null;
  windSpeed: number;
  windGust: number;
  isDay: boolean | null;
  pictoCode: number | string;
}
export interface IForecastHourly {
  dateTime: string;
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
  metadata: {
    provider: string;
    timezone: string;
    timezoneUTCOffsetInMinutes: number;
    dailyMode: boolean;
  };
  meteograms: IMeteograms[];
  sunCalendar: ISunCalendar[];
  forecastHourly: IForecastHourly[];
}

export interface IWeatherReport extends IWeatherPredictionDaily {
  bpaReports: IBpaReport[];
}

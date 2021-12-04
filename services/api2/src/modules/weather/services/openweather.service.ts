import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { IPointGeometry } from '../../common/types/geojson.type';
import {
  IForecastHourly,
  IRangeHourly,
  ISunCalendar,
  IWeatherPredictionDaily,
} from '../types/wheather-prediction.type';

@Injectable()
export class OpenWeatherService {
  constructor(private configService: ConfigService) {}

  // https://openweathermap.org/api/one-call-api
  API_BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall';
  OPEN_WEATHER_API_KEY = this.configService.get('OPEN_WEATHER_API_KEY');

  async getForecast(
    pointsOfInterest: IPointGeometry[],
    dailyMode = true,
  ): Promise<IWeatherPredictionDaily> {
    const startingPoint = pointsOfInterest[0];
    const startingPointAltitude = startingPoint.coordinates[2];

    if (startingPointAltitude == null) {
      throw new Error('Missing altitude for starting point');
    }
    const requests = pointsOfInterest.map(async (p) => {
      return await this.getData(p.coordinates[0], p.coordinates[1]);
    });
    const responses = await Promise.all(requests);
    // For sunmoon info, we assume it's the same info for all points in the route
    const apiResponse = JSON.parse(responses[0]);
    const utcOffsetSeconds = apiResponse.timezone_offset;

    const sunCalendar: ISunCalendar[] = [];

    apiResponse.daily.forEach((dailyData: OpenWeatherDailyData) => {
      sunCalendar.push({
        dateTime: this.getFormattedTime(dailyData.dt, utcOffsetSeconds),
        sunriseDateTime: this.getFormattedTime(dailyData.sunrise, utcOffsetSeconds),
        sunsetDateTime: this.getFormattedTime(dailyData.sunset, utcOffsetSeconds),
        moonriseDateTime: this.getFormattedTime(dailyData.moonrise, utcOffsetSeconds),
        moonsetDatetime: this.getFormattedTime(dailyData.moonset, utcOffsetSeconds),
        moonPhaseName: `${dailyData.moon_phase}`,
      });
    });
    const forecastHourly: IForecastHourly[] = [];
    const ranges: string[] = [];
    const jsonResponses: any[] = [];
    pointsOfInterest.forEach((p, i) => {
      const longitude = p.coordinates[0];
      const latitude = p.coordinates[1];
      const altitude = p.coordinates[2];

      if (altitude == null) {
        throw new Error(`Missing altitude for meteopoint lon:${longitude}, lat:${latitude}`);
      }

      let limInf, limSup;
      if (altitude <= 0) {
        limInf = -999;
        limSup = 0;
      } else {
        limInf = Math.floor(altitude / 1000) * 1000;
        limSup = Math.ceil(altitude / 1000) * 1000 - 1;
      }
      const range = `${limInf}-${limSup}`;
      ranges.push(range);
      jsonResponses.push(JSON.parse(responses[i]));
    });

    apiResponse.hourly.forEach((startPointHourlyData: OpenWeatherHourlyData, k: number) => {
      const hourlyRanges: IRangeHourly[] = [];
      ranges.forEach((v: string, i: number) => {
        let oneHourPrecipitation = null;
        const jsonResponse = jsonResponses[i];
        const hourlyData: OpenWeatherHourlyData = jsonResponse.hourly[k];
        const rainInfo = hourlyData.rain;
        if (rainInfo != null && rainInfo != undefined) {
          oneHourPrecipitation = Number(rainInfo['1h']);
        }
        hourlyRanges.push({
          range: v,
          temperature: hourlyData.temp,
          feltTemperature: hourlyData.feels_like,
          precipitation: oneHourPrecipitation,
          precipitationProbability: hourlyData.pop,
          visibility: hourlyData.visibility,
          lowClouds: hourlyData.clouds,
          midClouds: hourlyData.clouds,
          hiClouds: hourlyData.clouds,
          totalCloudCover: null,
          sunshineTime: null,
          windSpeed: hourlyData.wind_speed * 3.6, // convert to km/h
          windGust: hourlyData.wind_gust * 3.6,
          isDay: null,
          // this is inconsistent with their docs, weather should be an object
          // List of weather IDs and icons:
          // https://openweathermap.org/weather-conditions
          pictoCode: hourlyData.weather[0].icon,
        });
      });
      forecastHourly.push({
        dateTime: this.getFormattedTime(startPointHourlyData.dt, utcOffsetSeconds),
        ranges: hourlyRanges,
      });
    });
    const forecast = {
      metadata: {
        provider: 'Open Weather',
        timezone: apiResponse.timezone,
        timezoneUTCOffsetInMinutes: utcOffsetSeconds / 60,
        dailyMode: dailyMode,
      },
      meteograms: [],
      sunCalendar: sunCalendar,
      forecastHourly,
    };

    return forecast;
  }

  async getData(longitude: number, latitude: number) {
    const fullUrl = `${this.API_BASE_URL}?${this.getQueryParams(longitude, latitude)}`;
    const response = await got(fullUrl);
    return response.body;
  }

  getQueryParams(longitude: number, latitude: number): string {
    return `lat=${latitude}&lon=${longitude}&appid=${this.OPEN_WEATHER_API_KEY}&exclude=minutely,alerts,current&units=metric`;
  }

  getFormattedTime(secondsFromUtc: number, offsetUtcSeconds: number): string {
    const date = new Date(secondsFromUtc * 1000 + offsetUtcSeconds * 1000);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}${this.formatTimeUTCOffset(offsetUtcSeconds / 60)}`;
  }

  formatTimeUTCOffset(offsetMinutes: number) {
    const hours = `${Math.abs(Math.floor(offsetMinutes / 60))}`.padStart(2, '0');
    const minutes = `${offsetMinutes % 60}`.padStart(2, '0');
    const sign = offsetMinutes >= 0 ? '+' : '-';
    return `${sign}${hours}:${minutes}`;
  }
}

interface OpenWeatherHourlyData {
  dt: number;
  temp: number;
  feels_like: number;
  clouds: number;
  wind_speed: number;
  wind_gust: number;
  pop: number;
  visibility: number;
  rain: any;
  weather: WeatherInfo[];
}

interface WeatherInfo {
  id: number;
  icon: string;
}

interface OpenWeatherDailyData {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
}

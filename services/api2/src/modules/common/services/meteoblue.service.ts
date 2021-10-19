import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import {
  IRange,
  IWeatherForecast,
  IWeatherPrediction,
} from '../../route/types/wheather-prediction.type';

@Injectable()
export class MeteoblueService {
  constructor(private configService: ConfigService) {}

  async callTrendPro(longitude: number, latitude: number, altitude: number): Promise<string> {
    const response = await got('https://my.meteoblue.com/packages/trendpro-1h_basic-1h', {
      searchParams: {
        apikey: this.configService.get('METEOBLUE_API_KEY'),
        lat: latitude,
        lon: longitude,
        asl: altitude,
        format: 'json',
        tz: 'utc',
        timeformat: 'iso8601',
      },
    });
    return response.body;
  }
  async callSunMoon(longitude: number, latitude: number, altitude: number): Promise<string> {
    const response = await got('https://my.meteoblue.com/packages/sunmoon', {
      searchParams: {
        apikey: this.configService.get('METEOBLUE_API_KEY'),
        lon: longitude,
        lat: latitude,
        asl: altitude,
        format: 'json',
        tz: 'utc',
        timeformat: 'iso8601',
      },
    });
    return response.body;
  }
  parseResponse(
    resTrendPro: string[],
    resSunMoon: string,
    startDateTime: Date,
    ranges: string[],
  ): IWeatherPrediction[] {
    let offset = 0;
    if (startDateTime.getUTCDate() == new Date().getUTCDate()) {
      offset = startDateTime.getUTCHours();
    } else {
      offset =
        (startDateTime.getUTCDate() - new Date().getUTCDate()) * 24 + startDateTime.getUTCHours(); //we assume startDateTime is alwas a time after now
    }
    const dayOffset = startDateTime.getUTCDate() - new Date().getUTCDate();
    const arrayRangesData: IRange[][] = [];
    let weatherForecast: IWeatherForecast[] = [];
    ranges.forEach(function (v: string, i: number) {
      const meteoblueResponseTrendPro = JSON.parse(resTrendPro[i]);
      const time = meteoblueResponseTrendPro.trend_1h.time;
      const temperature = meteoblueResponseTrendPro.trend_1h.temperature;
      const feltTemperature = meteoblueResponseTrendPro.data_1h.felttemperature; //feltTemperature in basic-1h api package!!!!
      const precipitation = meteoblueResponseTrendPro.trend_1h.precipitation;
      const precipitationProbability = meteoblueResponseTrendPro.trend_1h.precipitation_probability;
      const visibility = meteoblueResponseTrendPro.trend_1h.visibility;
      const lowClouds = meteoblueResponseTrendPro.trend_1h.lowclouds;
      const midClouds = meteoblueResponseTrendPro.trend_1h.midclouds;
      const hiClouds = meteoblueResponseTrendPro.trend_1h.hiclouds;
      const totalCloudCover = meteoblueResponseTrendPro.trend_1h.totalcloudcover;
      const sunshineTime = meteoblueResponseTrendPro.trend_1h.sunshinetime;
      const windSpeed = meteoblueResponseTrendPro.trend_1h.windspeed;
      const windGust = meteoblueResponseTrendPro.trend_1h.gust;
      const isDay = meteoblueResponseTrendPro.data_1h.isdaylight; //isdaylighit in basic-1h api package!!!!
      const pictoCode = meteoblueResponseTrendPro.trend_1h.pictocode;
      weatherForecast = [];
      for (let k = offset; k < time.length; k++) {
        const t = new Date(time[k]);
        const forecastHourly = {
          dateTime: t,
          temperature: temperature[k],
          feltTemperature: feltTemperature[k],
          precipitation: precipitation[k],
          precipitationProbability: precipitationProbability[k],
          visibility: visibility[k],
          lowClouds: lowClouds[k],
          midClouds: midClouds[k],
          hiClouds: hiClouds[k],
          totalCloudCover: totalCloudCover[k],
          sunshineTime: sunshineTime[k],
          windSpeed: windSpeed[k],
          windGust: windGust[k],
          isDay: isDay[k],
          pictoCode: pictoCode[k],
        };
        weatherForecast.push(forecastHourly);
        if (k % 24 === 23) {
          const rangeData = {
            range: ranges[i],
            forecastHourly: weatherForecast,
          };
          const index = Math.trunc(k / 24) - dayOffset;
          const elemArrayRangesDate: IRange[] = arrayRangesData[index];
          if (elemArrayRangesDate) {
            elemArrayRangesDate.push(rangeData);
            arrayRangesData[index] = elemArrayRangesDate;
          } else {
            arrayRangesData.push([rangeData]);
          }
          weatherForecast = [];
        }
      }
    });
    const meteoblueResponseSunMoon = JSON.parse(resSunMoon);
    const time = meteoblueResponseSunMoon.data_day.time;
    const sunRiseTime = meteoblueResponseSunMoon.data_day.sunrise;
    const sunSetTime = meteoblueResponseSunMoon.data_day.sunset;
    const prediction: IWeatherPrediction[] = [];
    const sunMoonOffset = startDateTime.getUTCDate() - new Date(time[0]).getUTCDate();
    arrayRangesData.forEach(function (v, k) {
      prediction.push({
        dateTime: new Date(Date.parse(time[k + sunMoonOffset])),
        sunriseDateTime: new Date(
          Date.parse(time[k + sunMoonOffset] + ' ' + sunRiseTime[k + sunMoonOffset]),
        ),
        sunsetDateTime: new Date(
          Date.parse(time[k + sunMoonOffset] + ' ' + sunSetTime[k + sunMoonOffset]),
        ),
        ranges: arrayRangesData[k],
      });
    });
    return prediction;
  }
}

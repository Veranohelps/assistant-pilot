import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeteoblueService } from '../../common/services/meteoblue.service';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import { AppQuery } from '../../common/utilities/app-query';
import {
  IGetRouteWeatherUrlParameters,
  IWeatherPrediction,
} from '../types/wheather-prediction.type';

@Injectable()
export class WeatherService {
  constructor(private configService: ConfigService, private meteoblueService: MeteoblueService) {}

  async getForecast(
    coordinate: ILineStringGeometry,
    urlParameters: AppQuery<IGetRouteWeatherUrlParameters>,
  ): Promise<IWeatherPrediction[]> {
    //First approach: get starting point for the weather prediction. Later, make as many calls as "meteo point of interest" we have
    const longitude = coordinate.coordinates[0][0];
    const latitude = coordinate.coordinates[0][1];
    let altitude = coordinate.coordinates[0][2]; //TODO: More sophisticated form of make it safety if the altitude isn't provided...
    if (altitude === null) {
      altitude = 0;
    }
    //one call a trendpro for each meteo point of interest, so we'll have an array of api responses from trendpro package
    const apiResponseTrendPro = await this.meteoblueService.callTrendPro(
      longitude,
      latitude,
      altitude,
    );
    const apiResponseSunMoon = await this.meteoblueService.callSunMoon(
      longitude,
      latitude,
      altitude,
    );
    let limSup, limInf;
    if (altitude <= 0) {
      limInf = -999;
      limSup = 0;
    } else {
      limInf = Math.floor(altitude / 1000) * 1000;
      limSup = Math.ceil(altitude / 1000) * 1000 - 1;
    }
    const range = `${limInf}-${limSup}`;
    const startDateTime = urlParameters.hasFilter('dateTime')
      ? urlParameters.query['dateTime']
      : new Date();
    const forecast = this.meteoblueService.parseResponse(
      [apiResponseTrendPro],
      apiResponseSunMoon,
      new Date(startDateTime),
      [range],
    );
    return forecast;
  }
}

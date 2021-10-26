import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError } from '../../common/errors/http.error';
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
    urlParameters: IGetRouteWeatherUrlParameters,
  ): Promise<IWeatherPrediction[]> {
    const params = new AppQuery(urlParameters);
    //First approach: get starting point for the weather prediction. Later, make as many calls as "meteo point of interest" we have
    const longitude = coordinate.coordinates[0][0];
    const latitude = coordinate.coordinates[0][1];
    let altitude = coordinate.coordinates[0][2]; //TODO: More sophisticated form of make it safety if the altitude isn't provided...
    if (altitude === null) {
      altitude = 0;
    }
    //one call a trendpro for each meteo point of interest, so we'll have an array of api responses from trendpro package
    let apiResponseTrendPro, apiResponseSunMoon;
    try {
      apiResponseTrendPro = await this.meteoblueService.callTrendPro(longitude, latitude, altitude);
      apiResponseSunMoon = await this.meteoblueService.callSunMoon(longitude, latitude, altitude);
    } catch (error: any) {
      const errorMessage = JSON.parse(error.response.body).error_message;
      throw new BadRequestError(ErrorCodes.METEOBLUE_API_ERROR, errorMessage);
    }
    let limSup, limInf;
    if (altitude <= 0) {
      limInf = -999;
      limSup = 0;
    } else {
      limInf = Math.floor(altitude / 1000) * 1000;
      limSup = Math.ceil(altitude / 1000) * 1000 - 1;
    }
    const range = `${limInf}-${limSup}`;
    const startDateTime = params.hasField('dateTime') ? params.query['dateTime'] : new Date();
    const forecast = this.meteoblueService.parseResponse(
      [apiResponseTrendPro],
      apiResponseSunMoon,
      new Date(startDateTime),
      [range],
      longitude,
      latitude,
      altitude,
    );
    return forecast;
  }
}

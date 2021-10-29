import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError } from '../../common/errors/http.error';
import { MeteoblueService } from '../../common/services/meteoblue.service';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import { getAltitude, parseResponseHourly } from '../../weather/meteoblue.parser';
import { IWeatherPredictionDaily } from '../types/wheather-prediction.type';

@Injectable()
export class WeatherService {
  constructor(private configService: ConfigService, private meteoblueService: MeteoblueService) {}

  async getForecast(coordinate: ILineStringGeometry): Promise<IWeatherPredictionDaily> {
    // First approach: only one meteo point of interest, the starting point of the route
    // TODO: Make as many trendpro calls as meteo point of interest the route has (typically 1 or 2)
    const longitude = coordinate.coordinates[0][0];
    const latitude = coordinate.coordinates[0][1];
    const routeAltitude = coordinate.coordinates[0][2];

    // We only make ONE call to get sunmon information since we assume it's the same info
    // for all points in the route
    let apiResponseTrendPro, apiResponseSunMoon;
    try {
      apiResponseTrendPro = await this.meteoblueService.callTrendPro(
        longitude,
        latitude,
        routeAltitude,
      );
      apiResponseSunMoon = await this.meteoblueService.callSunMoon(
        longitude,
        latitude,
        routeAltitude,
      );
    } catch (error: any) {
      const errorMessage = JSON.parse(error.response.body).error_message;
      throw new BadRequestError(ErrorCodes.METEOBLUE_API_ERROR, errorMessage);
    }

    // TODO: also create as many ranges as meteo points of interest in the route
    let limSup, limInf;

    // NOTE (JD): using the altitude from Meteoblue
    // because sometimes our own altitude (from gpx) comes as 0 instead of null
    // Ideally we would use our own, but we need to handle optional altitudes better
    // when gpx files are uploaded. For now using MB data since it seems more reliable
    const altitude = getAltitude(apiResponseTrendPro);

    if (altitude <= 0) {
      limInf = -999;
      limSup = 0;
    } else {
      limInf = Math.floor(altitude / 1000) * 1000;
      limSup = Math.ceil(altitude / 1000) * 1000 - 1;
    }
    const range = `${limInf}-${limSup}`;

    const queryParams = this.meteoblueService.getQueryParams(
      latitude,
      longitude,
      altitude,
      false,
      false,
      5,
    );
    const signature = this.meteoblueService.getSignature(
      this.meteoblueService.METEOGRAM_QUERY_PATH + queryParams,
    );
    const meteogramUrl =
      this.meteoblueService.METEOBLUE_URL +
      this.meteoblueService.METEOGRAM_QUERY_PATH +
      queryParams +
      '&sig=' +
      signature;

    const forecast = parseResponseHourly(
      [apiResponseTrendPro],
      apiResponseSunMoon,
      [range],
      meteogramUrl,
    );

    return forecast;
  }
}

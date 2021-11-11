import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import got from 'got';
import { parseResponse } from '../meteoblue.parser';
import { ErrorCodes } from '../../common/errors/error-codes';
import { BadRequestError } from '../../common/errors/http.error';
import { IPointGeometry } from '../../common/types/geojson.type';
import { IWeatherPredictionDaily } from '../types/wheather-prediction.type';

@Injectable()
export class MeteoblueService {
  constructor(private configService: ConfigService) {}

  METEOBLUE_URL = 'https://my.meteoblue.com';
  METEOBLUE_API_KEY = this.configService.get('METEOBLUE_API_KEY');
  METEOBLUE_API_SECRET = this.configService.get('METEOBLUE_API_SECRET');
  THREE_MONTHS_MILLISECONDS = 3 * 30 * 24 * 60 * 60 * 1000;
  METEOGRAM_QUERY_PATH = '/visimage/meteogram_web?';
  PICTOPRINT_QUERY_PATH = '/visimage/pictoprint?';

  async getForecast(
    pointsOfInterest: IPointGeometry[],
    dailyMode = true,
  ): Promise<IWeatherPredictionDaily> {
    const startingPoint = pointsOfInterest[0];
    const longitude = startingPoint.coordinates[0];
    const latitude = startingPoint.coordinates[1];
    const startingPointAltitude = startingPoint.coordinates[2];

    if (startingPointAltitude == null) {
      throw new Error('Missing altitude for starting point');
    }

    // We only make ONE call to get sunmon information since we assume it's the same info
    // for all points in the route
    let apiResponseTrendPro, apiResponseSunMoon;

    try {
      apiResponseTrendPro = await this.callTrendPro(longitude, latitude, startingPointAltitude);
    } catch (error: any) {
      const errorMessage = JSON.parse(error.response.body).error_message;
      throw new BadRequestError(ErrorCodes.METEOBLUE_API_ERROR, errorMessage);
    }

    try {
      apiResponseSunMoon = await this.callSunMoon(longitude, latitude, startingPointAltitude);
    } catch (error: any) {
      const errorMessage = JSON.parse(error.response.body).error_message;
      throw new BadRequestError(ErrorCodes.METEOBLUE_API_ERROR, errorMessage);
    }

    let limInf, limSup;
    if (startingPointAltitude <= 0) {
      limInf = -999;
      limSup = 0;
    } else {
      limInf = Math.floor(startingPointAltitude / 1000) * 1000;
      limSup = Math.ceil(startingPointAltitude / 1000) * 1000 - 1;
    }
    const startingPointRange = `${limInf}-${limSup}`;

    const queryParams = this.getQueryParams(
      longitude,
      latitude,
      startingPointAltitude,
      false,
      false,
      5,
      dailyMode,
      2,
    );
    const signature = this.getSignature(
      (dailyMode ? this.METEOGRAM_QUERY_PATH : this.PICTOPRINT_QUERY_PATH) + queryParams,
    );
    const meteogramUrl =
      this.METEOBLUE_URL +
      (dailyMode ? this.METEOGRAM_QUERY_PATH : this.PICTOPRINT_QUERY_PATH) +
      queryParams +
      '&sig=' +
      signature;

    const forecast = parseResponse(
      [startingPointRange],
      meteogramUrl,
      [apiResponseTrendPro],
      apiResponseSunMoon,
      dailyMode,
    );

    return forecast;
  }

  getSignature(message: string): string {
    const hmac = crypto.createHmac('sha256', this.METEOBLUE_API_SECRET);
    const data = hmac.update(message);
    return data.digest('hex');
  }

  getQueryParams(
    longitude: number,
    latitude: number,
    altitude: number | null,
    timeFormat = true,
    json = true,
    forecastDays = 8,
    dailyMode = true,
    lookDays = 2,
  ): string {
    let params =
      `apikey=${this.METEOBLUE_API_KEY}&` +
      `forecast_days=${forecastDays}&` +
      `history_days=0&` +
      `lat=${latitude}&` +
      `lon=${longitude}&` +
      `expire=${Date.now() + this.THREE_MONTHS_MILLISECONDS}`;

    if (altitude) {
      params = params + `&asl=${altitude}`;
    }
    if (json) {
      params = params + `&format=json`;
    }

    if (timeFormat) {
      params = params + `&timeformat=iso8601`;
    }
    if (!dailyMode) {
      params = params + `&look=${lookDays}days`;
    }
    return params;
  }

  async callTrendPro(
    longitude: number,
    latitude: number,
    altitude: number | null,
  ): Promise<string> {
    try {
      const queryPath =
        `/packages/trendpro-1h_basic-1h?` + this.getQueryParams(longitude, latitude, altitude);
      const signature = this.getSignature(queryPath);
      const fullUrl = `${this.METEOBLUE_URL}${queryPath}&sig=${signature}`;
      const response = await got(fullUrl);
      return response.body;
    } catch (error) {
      throw error;
    }
  }
  async callSunMoon(longitude: number, latitude: number, altitude: number | null): Promise<string> {
    try {
      const queryPath = `/packages/sunmoon?` + this.getQueryParams(longitude, latitude, altitude);
      const signature = this.getSignature(queryPath);
      const fullUrl = `${this.METEOBLUE_URL}${queryPath}&sig=${signature}`;
      const response = await got(fullUrl);
      return response.body;
    } catch (error) {
      throw error;
    }
  }
}

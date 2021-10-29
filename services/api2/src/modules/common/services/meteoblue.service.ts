import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import got from 'got';

@Injectable()
export class MeteoblueService {
  constructor(private configService: ConfigService) {}

  METEOBLUE_URL = 'https://my.meteoblue.com';
  METEOBLUE_API_KEY = this.configService.get('METEOBLUE_API_KEY');
  METEOBLUE_API_SECRET = this.configService.get('METEOBLUE_API_SECRET');
  THREE_MONTHS_MILLISECONDS = 3 * 30 * 24 * 60 * 60 * 1000;
  METEOGRAM_QUERY_PATH = '/visimage/meteogram_web?';

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

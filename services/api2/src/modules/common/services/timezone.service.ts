import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { SRecord } from '../../../types/helpers.type';
import { IRoute, ITimeZone } from '../../route/types/route.type';
import { ILineStringGeometry } from '../types/geojson.type';
import { generateRecord2 } from '../utilities/generate-record';

@Injectable()
export class TimezoneService {
  constructor(private configService: ConfigService) {}

  API_BASE_URL = 'https://maps.googleapis.com/maps/api/timezone/json';
  GOOGLE_TIMEZONE_API_KEY = this.configService.get('GOOGLE_TIMEZONE_API_KEY');

  async getTimezone(coordinate: ILineStringGeometry): Promise<ITimeZone | null> {
    //let's assume routes in only one timezone, take the starting point
    const startingPoint = coordinate.coordinates[0];
    const startingLongitude = startingPoint[0];
    const startingLatitude = startingPoint[1];
    const fullUrl = `${this.API_BASE_URL}?${this.getQueryParams(
      startingLongitude,
      startingLatitude,
    )}`;
    try {
      const response = await got(fullUrl);
      const timeZoneResponse: TimeZoneResponse = JSON.parse(response.body);
      if (timeZoneResponse.status != TimeZoneStatus.OK) {
        console.error(`Error in api call ${fullUrl}, ${timeZoneResponse.errorMessage}`);
        return null;
      } else {
        return {
          dstOffset: timeZoneResponse.dstOffset,
          rawOffset: timeZoneResponse.rawOffset,
          timeZoneId: timeZoneResponse.timeZoneId,
          timeZoneName: timeZoneResponse.timeZoneName,
        };
      }
    } catch (err) {
      console.error(`Error in api call ${fullUrl}, ${err}`);
      return null;
    }
  }
  getQueryParams(longitude: number, latitude: number): string {
    const timestamp = new Date().getTime() / 1000;
    return `location=${latitude}%2C${longitude}&timestamp=${timestamp}&key=${this.GOOGLE_TIMEZONE_API_KEY}`;
  }
  async getTimezones(routes: IRoute[]): Promise<SRecord<ITimeZone | null>> {
    const requests = routes.map(async (r) => {
      const timezone = await this.getTimezone(r.coordinate as ILineStringGeometry);

      return {
        routeId: r.id,
        timezone,
      };
    });
    const timezones = Promise.all(requests).then(
      generateRecord2(
        (t) => t.routeId,
        (t) => t.timezone,
      ),
    );
    return timezones;
  }
}

export interface TimeZoneResponse {
  status: TimeZoneStatus;
  errorMessage?: string;
  dstOffset?: number;
  rawOffset?: number;
  timeZoneId?: string;
  timeZoneName?: string;
}
export enum TimeZoneStatus {
  OK = 'OK',
  INVALID_REQUEST = 'INVALID_REQUEST',
  OVER_DAILY_LIMIT = 'OVER_DAILY_LIMIT',
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  REQUEST_DENIED = 'REQUEST_DENIED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  ZERO_RESULTS = 'ZERO_RESULTS',
}

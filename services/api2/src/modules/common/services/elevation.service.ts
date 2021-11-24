import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { IPointGeometry } from '../types/geojson.type';

@Injectable()
export class ElevationService {
  constructor(private configService: ConfigService) {}

  API_BASE_URL = 'https://maps.googleapis.com/maps/api/elevation/json';
  GOOGLE_ELEVATION_API_KEY = this.configService.get('GOOGLE_ELEVATION_API_KEY');

  async getElevation(coordinate: IPointGeometry): Promise<ElevationResponse> {
    const longitude = coordinate.coordinates[0];
    const latitude = coordinate.coordinates[1];
    const fullUrl = `${this.API_BASE_URL}?${this.getQueryParams(longitude, latitude)}`;
    const response = await got(fullUrl);
    return JSON.parse(response.body);
  }

  getQueryParams(longitude: number, latitude: number): string {
    return `locations=${latitude}%2C${longitude}&key=${this.GOOGLE_ELEVATION_API_KEY}`;
  }
}
interface LatLngLiteral {
  lat: number;
  lon: number;
}
interface ElevationResult {
  elevation: number;
  location: LatLngLiteral;
  resolution?: number;
}
interface ElevationResponse {
  results: ElevationResult[];
  status: ElevationStatus;
  error_message: string;
}
export enum ElevationStatus {
  OK = 'OK',
  DATA_NOT_AVAILABLE = 'DATA_NOT_AVAILABLE',
  INVALID_REQUEST = 'INVALID_REQUEST',
  OVER_DAILY_LIMIT = 'OVER_DAILY_LIMIT',
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  REQUEST_DENIED = 'REQUEST_DENIED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMultiPointGeometry, IPointGeometry } from '../../common/types/geojson.type';
import { IWeatherPredictionDaily } from '../types/wheather-prediction.type';
import { MeteoblueService } from './meteoblue.service';
//import { OpenWeatherService } from './openweather.service';

@Injectable()
export class WeatherService {
  MILLISECONDS_IN_TWO_DAYS = 24 * 60 * 60 * 1000 * 2;

  constructor(private configService: ConfigService, private weatherProvider: MeteoblueService) {}

  async getForecast(
    coordinate: IMultiPointGeometry,
    dailyMode = true,
  ): Promise<IWeatherPredictionDaily> {
    const altitude = coordinate.coordinates[0][2];
    if (altitude == null) {
      console.warn("No altitude available for route's starting point");
    }
    const points: IPointGeometry[] = [];
    coordinate.coordinates.forEach((c) => {
      const coordinateLon = c[0];
      const coordinateLat = c[1];
      const coordinateAlt = c[2];
      points.push({
        type: 'Point',
        coordinates: [coordinateLon, coordinateLat, coordinateAlt],
      });
    });
    return this.weatherProvider.getForecast(points, dailyMode);
  }
  calculateDailyMode(dateTime: Date): boolean {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + this.MILLISECONDS_IN_TWO_DAYS);
    return dateTime >= twoDaysFromNow;
  }
}

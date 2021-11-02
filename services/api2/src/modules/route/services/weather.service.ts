import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeteoblueService } from '../../common/services/meteoblue.service';
// import { OpenWeatherService } from '../../common/services/openweather.service';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import { IWeatherPredictionDaily } from '../types/wheather-prediction.type';

@Injectable()
export class WeatherService {
  constructor(private configService: ConfigService, private weatherProvider: MeteoblueService) {}

  async getForecast(coordinate: ILineStringGeometry): Promise<IWeatherPredictionDaily> {
    // First approach: only one meteo point of interest, the starting point of the route
    const longitude = coordinate.coordinates[0][0];
    const latitude = coordinate.coordinates[0][1];
    const altitude = coordinate.coordinates[0][2];

    if (altitude == null) {
      console.warn("No altitude available for route's starting point");
    }

    return this.weatherProvider.getForecast([
      {
        type: 'Point',
        coordinates: [longitude, latitude, altitude],
      },
    ]);
  }
}

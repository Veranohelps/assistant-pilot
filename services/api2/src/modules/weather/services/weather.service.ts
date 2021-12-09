import { Injectable } from '@nestjs/common';
import { BpaReportService } from '../../bpa/services/bpa-report.service';
import { ILineStringGeometry, IPointGeometry } from '../../common/types/geojson.type';
import { IRoute } from '../../route/types/route.type';
import { IWeatherReport } from '../types/wheather-prediction.type';
import { MeteoblueService } from './meteoblue.service';

@Injectable()
export class WeatherService {
  MILLISECONDS_IN_TWO_DAYS = 24 * 60 * 60 * 1000 * 2;

  constructor(
    private weatherProvider: MeteoblueService,
    private bpaReportService: BpaReportService,
  ) {}

  async getForecast(route: IRoute, dailyMode = true): Promise<IWeatherReport> {
    const altitude = route.meteoPointsOfInterests.coordinates[0][2];

    if (altitude == null) {
      console.warn("No altitude available for route's starting point");
    }

    const points: IPointGeometry[] = [];

    route.meteoPointsOfInterests.coordinates.forEach((c) => {
      const coordinateLon = c[0];
      const coordinateLat = c[1];
      const coordinateAlt = c[2];
      points.push({
        type: 'Point',
        coordinates: [coordinateLon, coordinateLat, coordinateAlt],
      });
    });

    const [weather, bpaReports] = await Promise.all([
      this.weatherProvider.getForecast(points, dailyMode),
      this.bpaReportService.getTrackReports(null, route.coordinate as ILineStringGeometry),
    ]);

    return { ...weather, bpaReports };
  }

  calculateDailyMode(dateTime: Date): boolean {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + this.MILLISECONDS_IN_TWO_DAYS);
    return dateTime >= twoDaysFromNow;
  }
}

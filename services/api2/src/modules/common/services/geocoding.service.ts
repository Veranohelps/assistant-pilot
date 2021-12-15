import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { ErrorCodes } from '../errors/error-codes';
import { ServerError } from '../errors/http.error';
import { IGeocodeResult, IGeocodeViewport, IGoogleGeocodeResponse } from '../types/geocode.type';
import { IPolygonGeometry } from '../types/geojson.type';

@Injectable()
export class GeocodingService {
  geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  placeUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = configService.get('GOOGLE_GEOCODING_API_KEY') as string;
  }

  viewPortToPolygon(viewPort: IGeocodeViewport): IPolygonGeometry {
    const { northeast, southwest } = viewPort;
    return {
      type: 'Polygon',
      coordinates: [
        [
          [northeast.lng, northeast.lat],
          [northeast.lng, southwest.lat],
          [southwest.lng, southwest.lat],
          [southwest.lng, northeast.lat],
          [northeast.lng, northeast.lat],
        ],
      ],
    };
  }

  async searchByName(name: string): Promise<IGeocodeResult[]> {
    const res = await got
      .get(this.geocodeUrl, {
        searchParams: {
          address: name,
          key: this.apiKey,
          // TODO
          // region and language should be passed as arguments from request headers
          region: 'es',
          language: 'es',
        },
      })
      .json<IGoogleGeocodeResponse>();

    if (!(res.status === 'OK' || res.status === 'ZERO_RESULTS')) {
      console.error(res);

      throw new ServerError(ErrorCodes.SERVER_ERROR, 'Something happened, we are working on it');
    }

    return res.results;
  }
}

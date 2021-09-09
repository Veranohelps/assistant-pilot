import { Injectable } from '@nestjs/common';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { IGeoJSON, ILineStringGeometry } from '../../common/types/geojson.type';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IRoute } from '../types/route.type';

@Injectable()
export class RouteService {
  constructor(
    @InjectKnexClient('Route')
    private db: KnexClient<'Route'>,
  ) {}

  async fromGeoJson(tx: TransactionManager, geojson: IGeoJSON): Promise<IRoute> {
    const coordinates = geojson.features
      .filter((feature) => feature.geometry.type === 'LineString')
      .map((feat) =>
        (feat.geometry as ILineStringGeometry).coordinates.map(
          ([longitude, latitude, altitude]) => {
            return {
              latitude,
              longitude,
              altitude,
            };
          },
        ),
      )
      .flat()
      .filter((location) => location.altitude !== null && location.longitude !== null);
    const [route] = await this.db
      .write(tx)
      .insert({
        name: geojson.features[0]?.properties.name,
        coordinate: this.db.knex.raw(
          `ST_GeogFromText('LINESTRINGZ(${coordinates
            .map((c) => `${c.longitude} ${c.latitude} ${c.altitude ?? 0}`)
            .join(',')})')`,
        ),
      })
      .returning('*');

    return route;
  }

  async findOne(tx: TransactionManager | null, id: string): Promise<IRoute> {
    const route = await this.db.read(tx).where({ id }).first();

    if (!route) {
      throw new NotFoundError(ErrorCodes.ROUTE_NOT_FOUND, 'Route not found');
    }

    return route;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<IRoute[]> {
    const routes = await this.db.read(tx).whereIn('id', ids);

    return routes;
  }
}

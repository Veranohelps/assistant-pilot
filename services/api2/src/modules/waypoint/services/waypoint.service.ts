import { Injectable } from '@nestjs/common';
import { IGeoJSON, IPointGeometry } from '../../common/types/geojson.type';
import { AppQuery } from '../../common/utilities/app-query';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ERouteOrigins } from '../../route/types/route-origin.type';
import { IGetRouteWaypointOptions, IWaypoint } from '../types/waypoint.type';

@Injectable()
export class WaypointService {
  constructor(
    @InjectKnexClient('Waypoint')
    private db: KnexClient<'Waypoint'>,
  ) {}

  async fromGeoJson(
    tx: TransactionManager,
    originId: ERouteOrigins,
    geojson: IGeoJSON,
  ): Promise<IWaypoint[]> {
    const newPoints = geojson.features
      .filter((feature) => feature.geometry.type === 'Point')
      .map((point) => {
        const {
          coordinates: [longitude, latitude, altitude],
        } = point.geometry as IPointGeometry;

        return {
          name: point.properties.name,
          description: point.properties.desc,
          type: 'waypoint',
          radiusInMeters: 100,
          originId,
          coordinate: this.db.knex.raw(
            `ST_GeogFromText('POINTZ(${longitude} ${latitude} ${altitude ?? 0})')`,
          ),
        };
      });

    if (newPoints.length === 0) {
      return [];
    }

    const waypoints = await this.db.write(tx).insert(newPoints).returning('*');

    return waypoints;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<IWaypoint[]> {
    const waypoints = await this.db.read(tx).whereIn('id', ids);

    return waypoints;
  }

  async getRouteWaypoints(
    tx: TransactionManager | null,
    ids: string[],
    options: IGetRouteWaypointOptions = { searchWaypointsBy: 'track' },
  ) {
    const opts = new AppQuery(options);
    const builder = this.db.read(tx).select({ routeId: 'Route.id' });

    opts
      .withFieldValue('searchWaypointsBy', 'track', () => {
        builder.join('Route', (b) =>
          b
            .on(
              this.db.knex.raw('st_dwithin(??, ??, ?)', [
                'Waypoint.coordinate',
                'Route.coordinate',
                200,
              ]),
            )
            .andOnIn('Route.id', ids),
        );
      })
      .withFieldValue('searchWaypointsBy', 'boundingBox', () => {
        builder.join('Route', (b) =>
          b
            .on(
              this.db.knex.raw('st_dwithin(??, ??, ?)', [
                'Waypoint.coordinate',
                'Route.boundingBox',
                200,
              ]),
            )
            .andOnIn('Route.id', ids),
        );
      });

    const waypoints = (await builder) as unknown as (IWaypoint & { routeId: string })[];

    return waypoints;
  }
}

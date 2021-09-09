import { Injectable } from '@nestjs/common';
import { IGeoJSON, IPointGeometry } from '../../common/types/geojson.type';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IWaypoint } from '../types/waypoint.type';

@Injectable()
export class WaypointService {
  constructor(
    @InjectKnexClient('Waypoint')
    private db: KnexClient<'Waypoint'>,
  ) {}

  async fromGeoJson(tx: TransactionManager, geojson: IGeoJSON): Promise<IWaypoint[]> {
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
}

import { Injectable } from '@nestjs/common';
import { SRecord } from '../../../types/helpers.type';
import { ErrorCodes } from '../../common/errors/error-codes';
import { NotFoundError } from '../../common/errors/http.error';
import { IGeoJSON, ILineStringGeometry, IPolygonGeometry } from '../../common/types/geojson.type';
import { generateRecord2 } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { IBpaZone, ICreateBpaZoneDTO } from '../types/bpa-zone.type';

@Injectable()
export class BpaZoneService {
  constructor(
    @InjectKnexClient('BpaZone')
    private db: KnexClient<'BpaZone'>,
  ) {}

  geoJsonToPolygonGeometry(geojson: IGeoJSON): IPolygonGeometry {
    const [coordinates] = geojson.features
      .filter((feature) => feature.geometry.type === 'Polygon')
      .map((feat) =>
        (feat.geometry as IPolygonGeometry).coordinates.map(([longitude, latitude]) => {
          return [longitude, latitude];
        }),
      );

    return { type: 'Polygon', coordinates: coordinates as IPolygonGeometry['coordinates'] };
  }

  async create(
    tx: TransactionManager,
    payload: ICreateBpaZoneDTO,
    geoJson: IGeoJSON,
  ): Promise<IBpaZone> {
    const [zone] = await this.db
      .write(tx)
      .insert({
        name: payload.name,
        coordinate: this.db.knex.raw('ST_GeomFromGeoJSON(?)', [
          JSON.stringify(this.geoJsonToPolygonGeometry(geoJson)),
        ]),
      })
      .cReturning();

    return zone;
  }

  async findOne(tx: TransactionManager | null, id: string): Promise<IBpaZone> {
    const zone = await this.db.read(tx).where({ id }).first();

    if (!zone) {
      throw new NotFoundError(ErrorCodes.BPA_ZONE_NOT_FOUND, 'BPA zone not found');
    }

    return zone;
  }

  async findByIds(tx: TransactionManager | null, ids: string[]): Promise<SRecord<IBpaZone>> {
    const zones = await this.db
      .read(tx)
      .whereIn('id', ids)
      .then(generateRecord2((z) => z.id));

    return zones;
  }

  async getZones(): Promise<IBpaZone[]> {
    const zones = await this.db.read().orderBy('createdAt', 'desc');

    return zones;
  }

  async getZonesForTrack(
    tx: TransactionManager | null,
    track: ILineStringGeometry,
  ): Promise<IBpaZone[]> {
    const zones = await this.db
      .read(tx)
      .where(
        this.db.knex.raw('ST_Intersects(coordinate, ST_GeomFromGeoJSON(?))', [
          JSON.stringify(track),
        ]),
      );

    return zones;
  }
}

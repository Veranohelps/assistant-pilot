// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { gpx } from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';
import { knexClient } from '../../database/knex/init-knex';
import { IGeoJSON } from '../types/geojson.type';

// a placeholder raw geometry for bulk updates using upsert
// where the entity geometry data is not being updated.
// Remember to exclude columns assigned this placeholder
// from merge columns on conflict
export const pointGeometryPlaceholder = knexClient.raw(`st_geomfromtext('point(1 1 1 )')`);
export const polygonGeometryPlaceholder = knexClient.raw(
  `st_geomfromtext('POLYGON ((1 1, 1 1, 1 1, 1 1, 1 1))')`,
);
export const lineStringGeometryPlaceholder = knexClient.raw(
  `st_geomfromtext('linestringz(1 1 1, 2 2 2)')`,
);

const gpxToGeoJSON = (gpxString: string): IGeoJSON => {
  const gpxDocument = new DOMParser().parseFromString(gpxString);
  const parsedDocument: IGeoJSON = gpx(gpxDocument);

  return parsedDocument;
};

export default gpxToGeoJSON;

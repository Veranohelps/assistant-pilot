// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { gpx } from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';
import { IGeoJSON } from '../types/geojson.type';

const gpxToGeoJSON = (gpxString: string): IGeoJSON => {
  const gpxDocument = new DOMParser().parseFromString(gpxString);
  const parsedDocument: IGeoJSON = gpx(gpxDocument);

  return parsedDocument;
};

export default gpxToGeoJSON;

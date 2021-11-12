import { round } from 'lodash';
import { ILineStringGeometry, IMultiPointGeometry } from '../../common/types/geojson.type';

export interface IRouteAnalysis {
  highestPointInMeters: number;
  lowestPointInMeters: number;
  elevationGainInMeters: number;
  elevationLossInMeters: number;
  meteoPointsOfInterests: IMultiPointGeometry;
}

type TCoordinate = [number, number, number];

export const analyseRoute = (track: ILineStringGeometry): IRouteAnalysis => {
  let highestPointInMeters = 0;
  let lowestPointInMeters = 0;
  let inclinationGainInMeters = 0;
  let inclinationLossInMeters = 0;
  const meteoPointsOfInterests: Map<number, [number, number, number]> = new Map();
  let startMeteoPointRange = 0;

  track.coordinates.forEach((coordinate, index) => {
    const [, , alt] = coordinate;

    if (alt) {
      // highest/lowest point calculations
      if (index === 0) {
        highestPointInMeters = alt;
        lowestPointInMeters = alt;
      } else if (alt > highestPointInMeters) {
        highestPointInMeters = alt;
      } else if (alt < lowestPointInMeters) {
        lowestPointInMeters = alt;
      }

      // meteo points calculations
      const meteoPointRange = Math.floor(alt / 1000) * 1000;

      // get start meteo point range from the first point
      // and set the coordinate as a meteo point
      if (index === 0) {
        startMeteoPointRange = meteoPointRange;

        meteoPointsOfInterests.set(meteoPointRange, coordinate as TCoordinate);
      } else {
        const currentInterestPoint = meteoPointsOfInterests.get(meteoPointRange);

        // if the current range is not equal to the range of the start point
        // (the start point must always be included in the points of interest)
        // and no meteo point has been set for this range or the set point
        // has an altitude lower than the current coordinate's altitude,
        // set the current coordinate as the meteo point for the current range.
        if (
          meteoPointRange !== startMeteoPointRange &&
          (!currentInterestPoint || currentInterestPoint[2] < alt)
        ) {
          meteoPointsOfInterests.set(meteoPointRange, coordinate as TCoordinate);
        }
      }

      // previous altitude (altitude of the previous point)
      const prevAlt = track.coordinates[index > 0 ? index - 1 : 0][2];

      // inclination gain/loss calculations
      if (prevAlt) {
        const diff = alt - prevAlt;

        if (diff > 0) {
          inclinationGainInMeters += diff;
        } else {
          inclinationLossInMeters += Math.abs(diff);
        }
      }
    }
  });

  return {
    highestPointInMeters,
    lowestPointInMeters,
    elevationGainInMeters: inclinationGainInMeters,
    elevationLossInMeters: inclinationLossInMeters,
    meteoPointsOfInterests: {
      type: 'MultiPoint',
      coordinates: Array.from(meteoPointsOfInterests.values()),
    },
  };
};

interface IGetEstimatedTimeOptions {
  distance: number;
  eGain: number;
  eLoss: number;
  uphillPace: number;
  downhillPace: number;
  defaultPace: number;
  unknown: number;
}

export const getEstimatedTime = (options: IGetEstimatedTimeOptions): number => {
  const uphillEstimate = options.eGain / options.uphillPace;
  const downhillEstimate = options.eLoss / options.downhillPace;
  const estimate = options.distance / options.defaultPace;

  const estimateToSummit =
    Math.max(uphillEstimate, estimate) + Math.min(uphillEstimate, estimate) / 2;
  const estimateToStart =
    Math.max(downhillEstimate, estimate) + Math.min(downhillEstimate, estimate) / 2;
  const totalTimeInMinutes = (estimateToSummit + estimateToStart) * 60 * (options.unknown / 100);

  return round(totalTimeInMinutes, 2);
};

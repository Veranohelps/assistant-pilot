import { ILineStringGeometry } from '../../../common/types/geojson.type';
import { analyseRoute, getEstimatedTime } from '../analyse-route';

describe('Route analysis', () => {
  describe('Analyse route', () => {
    it('properly analyses a flat route', () => {
      const track: ILineStringGeometry = {
        type: 'LineString',
        coordinates: [
          [1, 3, 100],
          [1, 4, 100],
          [1, 5, 100],
          [1, 4, 100],
        ],
      };
      const analysis = analyseRoute(track);

      expect(analysis.elevationGainInMeters).toEqual(0);
      expect(analysis.elevationLossInMeters).toEqual(0);
      expect(analysis.highestPointInMeters).toEqual(100);
      expect(analysis.lowestPointInMeters).toEqual(100);
      expect(analysis.meteoPointsOfInterests.coordinates).toEqual([track.coordinates[0]]);
    });

    it('properly analyses a not so flat route', () => {
      const track: ILineStringGeometry = {
        type: 'LineString',
        coordinates: [
          [1, 3, 1400],
          [1, 4, 700],
          [1, 5, 2100],
          [1, 4, 900],
          [1, 4, 1600],
        ],
      };
      const analysis = analyseRoute(track);

      expect(analysis.elevationGainInMeters).toEqual(2100);
      expect(analysis.elevationLossInMeters).toEqual(1900);
      expect(analysis.highestPointInMeters).toEqual(2100);
      expect(analysis.lowestPointInMeters).toEqual(700);
      expect(analysis.meteoPointsOfInterests.coordinates).toEqual([
        track.coordinates[0],
        track.coordinates[3],
        track.coordinates[2],
      ]);
    });
  });

  describe('getEstimatedTime', () => {
    it('get the estimated time in minutes, based on https://docs.google.com/spreadsheets/d/1y0BlsudGh_mbRPcWtcUZ19yS6EDmDMY-D9h1jrONewU/edit#gid=0', () => {
      const estimate1 = getEstimatedTime({
        distance: 10078,
        uphillPace: 400,
        downhillPace: 600,
        defaultPace: 4000,
        eGain: 877,
        eLoss: 877,
        unknown: 20,
      });
      const estimate2 = getEstimatedTime({
        distance: 10078,
        uphillPace: 400,
        downhillPace: 1200,
        defaultPace: 3000,
        eGain: 877,
        eLoss: 877,
        unknown: 20,
      });

      expect(estimate1).toBeCloseTo(353.802);
      expect(estimate2).toBeCloseTo(365.574);
    });
  });
});

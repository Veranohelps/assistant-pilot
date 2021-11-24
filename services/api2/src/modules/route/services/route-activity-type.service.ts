import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { SRecord } from '../../../types/helpers.type';
import { generateGroupRecord2, recordToArray } from '../../common/utilities/generate-record';
import { TransactionManager } from '../../common/utilities/transaction-manager';
import { KnexClient } from '../../database/knex/client.knex';
import { InjectKnexClient } from '../../database/knex/decorator.knex';
import { ICreateRouteActivityType, IRouteActivityType } from '../types/route-activity-type.type';
import { IRoute } from '../types/route.type';
import { getEstimatedTime } from '../utils/analyse-route';
import { ActivityTypeService } from './activity-type.service';

@Injectable()
export class RouteActivityTypeService {
  constructor(
    @InjectKnexClient('RouteActivityType')
    private db: KnexClient<'RouteActivityType'>,
    private activityTypeService: ActivityTypeService,
  ) {}

  async addActivities(tx: TransactionManager, route: IRoute): Promise<IRouteActivityType[]> {
    const entries = _.mapValues(
      this.activityTypeService.findByIds(route.activityTypeIds),
      (type): ICreateRouteActivityType => ({
        routeId: route.id,
        activityTypeId: type.id,
        estimatedDurationInMinutes: getEstimatedTime({
          distance: route.distanceInMeters,
          eGain: route.elevationGainInMeters,
          eLoss: route.elevationLossInMeters,
          uphillPace: type.uphillPace,
          downhillPace: type.downhillPace,
          defaultPace: type.defaultPace,
          unknown: type.unknownPercentage,
        }),
        estimatedDurationToMeteoPointsOfInterestsInMinutes:
          route.meteoPointsOfInterestsRoutePartials.map((MPIPartial) => ({
            coordinate: MPIPartial.coordinate,
            estimatedTime: getEstimatedTime({
              distance: MPIPartial.distanceInMeters,
              eGain: MPIPartial.elevationGainInMeters,
              eLoss: MPIPartial.elevationLossInMeters,
              uphillPace: type.uphillPace,
              downhillPace: type.downhillPace,
              defaultPace: type.defaultPace,
              unknown: type.unknownPercentage,
            }),
          })),
      }),
    );

    const routeActivityTypes = await this.db
      .write(tx)
      .insert(recordToArray(entries as any))
      .returning('*');

    return routeActivityTypes;
  }

  async updateEstimations(tx: TransactionManager, routes: IRoute[]): Promise<IRouteActivityType[]> {
    const updates: ICreateRouteActivityType[] = [];

    routes.forEach((route) => {
      _.forEach(this.activityTypeService.findByIds(route.activityTypeIds), (type) => {
        updates.push({
          routeId: route.id,
          activityTypeId: type.id,
          estimatedDurationInMinutes: getEstimatedTime({
            distance: route.distanceInMeters,
            eGain: route.elevationGainInMeters,
            eLoss: route.elevationLossInMeters,
            uphillPace: type.uphillPace,
            downhillPace: type.downhillPace,
            defaultPace: type.defaultPace,
            unknown: type.unknownPercentage,
          }),
          estimatedDurationToMeteoPointsOfInterestsInMinutes:
            route.meteoPointsOfInterestsRoutePartials.map((MPIPartial) => ({
              coordinate: MPIPartial.coordinate,
              estimatedTime: getEstimatedTime({
                distance: MPIPartial.distanceInMeters,
                eGain: MPIPartial.elevationGainInMeters,
                eLoss: MPIPartial.elevationLossInMeters,
                uphillPace: type.uphillPace,
                downhillPace: type.downhillPace,
                defaultPace: type.defaultPace,
                unknown: type.unknownPercentage,
              }),
            })),
        });
      });
    });

    const routeActivityTypes = await this.db
      .write(tx)
      .insert(updates)
      .onConflict(['routeId', 'activityTypeId'])
      .merge()
      .returning('*');

    return routeActivityTypes;
  }

  async updateActivities(tx: TransactionManager, route: IRoute): Promise<IRouteActivityType[]> {
    await this.db
      .write(tx)
      .where({ routeId: route.id })
      .whereNotIn('activityTypeId', route.activityTypeIds)
      .del();

    const routeActivityTypes = await this.updateEstimations(tx, [route]);

    return routeActivityTypes;
  }

  async getRouteActivities(
    tx: TransactionManager | null,
    routeId: string,
  ): Promise<IRouteActivityType[]> {
    const activities = await this.db.read(tx).where({ routeId });

    return activities;
  }

  async getActivitiesByRouteIds(
    tx: TransactionManager | null,
    routeId: string[],
  ): Promise<SRecord<IRouteActivityType[]>> {
    const activities = await this.db
      .read(tx)
      .whereIn('routeId', routeId)
      .then(generateGroupRecord2((a) => a.routeId));

    return activities;
  }
}

export type TEstimatedTimeToMPI = {
  coordinate: [number, number, number | null];
  estimatedTime: number;
};

export interface IRouteActivityType {
  routeId: string;
  activityTypeId: string;
  estimatedDurationInMinutes: number;
  estimatedDurationToMeteoPointsOfInterestsInMinutes: TEstimatedTimeToMPI[];
}

export interface ICreateRouteActivityType {
  routeId: string;
  activityTypeId: string;
  estimatedDurationInMinutes: number;
  estimatedDurationToMeteoPointsOfInterestsInMinutes: TEstimatedTimeToMPI[];
}

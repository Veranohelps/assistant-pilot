import { IBaseResponse } from './request';

export interface IActivityType {
  id: string;
  name: string;
  description: string;
}

export interface IGetActivityTypesResponse extends IBaseResponse {
  data: {
    activityTypes: IActivityType[];
  };
}

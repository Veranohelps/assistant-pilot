import { apiBaseUrl } from '../config/environment';
import { IGetActivityTypesResponse } from '../types/activity-type';
import { http } from './httpService';

const activityTypeHttp = http.extend({ prefixUrl: `${apiBaseUrl}/admin/activity-type` });

export const getActivityTypesService = async () => {
  const response = await activityTypeHttp.get('').json<IGetActivityTypesResponse>();

  return response;
};

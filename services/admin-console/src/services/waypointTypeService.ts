import { apiBaseUrl } from '../config/environment';
import { IGetWaypointTypesResponse } from '../types/waypoint-type';
import { http } from './httpService';

const waypointTypeHttp = http.extend({ prefixUrl: `${apiBaseUrl}/admin/waypoint-type` });

export const getWaypointTypesService = async () => {
  const response = await waypointTypeHttp.get('').json<IGetWaypointTypesResponse>();

  return response;
};

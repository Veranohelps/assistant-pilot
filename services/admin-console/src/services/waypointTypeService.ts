import { apiBaseUrl } from '../config/environment';
import { IGetWaypointTypesResponse } from '../types/waypoint-type';
import { http } from './httpService';

const waypointHttp = http.extend({ prefixUrl: `${apiBaseUrl}/admin/waypoint-type` });

export const getWaypointTypesService = async () => {
  const response = await waypointHttp.get('').json<IGetWaypointTypesResponse>();

  return response;
};

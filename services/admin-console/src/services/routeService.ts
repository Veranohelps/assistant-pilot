import { apiBaseUrl } from '../config/environment';
import { IBaseResponse } from '../types/request';
import { ICreateRoutePayload, IGetRouteResult, IGetRoutesResult } from '../types/route';
import { http } from './httpService';

const routeHttp = http.extend({ prefixUrl: `${apiBaseUrl}/admin/route` });

export const getRoutesService = async () => {
  const response = await routeHttp.get('').json<IGetRoutesResult>();

  return response;
};

export const createRouteService = async (data: ICreateRoutePayload) => {
  const form = new FormData();

  form.append('gpx', data.gpx);
  form.append('name', data.name);
  data.activityTypes.forEach((type) => {
    form.append('activityTypes', type);
  });
  data.description && form.append('description', data.description);

  const response = await routeHttp.post('create', { body: form }).json<IGetRoutesResult>();

  return response.data;
};

export const getRouteByIdService = async (id: string) => {
  const response = await routeHttp.get(id).json<IGetRouteResult>();

  return response;
};

export const editRouteService = async (id: string, data: Partial<ICreateRoutePayload>) => {
  const form = new FormData();

  data.gpx && form.append('gpx', data.gpx);
  data.name && form.append('name', data.name);
  data.activityTypes?.forEach((type) => {
    form.append('activityTypes', type);
  });
  data.description && form.append('description', data.description);

  const response = await routeHttp.patch(`${id}/update`, { body: form }).json<IGetRouteResult>();

  return response;
};

export const deleteRouteService = async (id: string) => {
  const response = await routeHttp.delete(id).json<IBaseResponse>();

  return response;
};

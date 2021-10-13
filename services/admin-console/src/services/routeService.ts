import { apiBaseUrl } from '../config/environment';
import { ICreateExpeditionPayload, IGetRoutesResult } from '../types/route';
import { http } from './httpService';

const routeHttp = http.extend({ prefixUrl: `${apiBaseUrl}/admin/route` });

export const getRoutesService = async () => {
  const response = await routeHttp.get('').json<IGetRoutesResult>();

  return response;
};

export const createRouteService = async (data: ICreateExpeditionPayload) => {
  const form = new FormData();

  form.append('gpx', data.gpx);
  form.append('name', data.name);

  const response = await routeHttp.post('create', { body: form }).json<IGetRoutesResult>();

  return response.data;
};

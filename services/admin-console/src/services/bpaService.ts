import { apiBaseUrl } from '../config/environment';
import {
  ICreatBpaReportPayload,
  ICreateBpaProviderPayload,
  ICreateBpaProviderResponse,
  ICreateBpaReportResponse,
  ICreateBpaZonePayload,
  ICreateBpaZoneResponse,
  IGetBpaProvidersResponse,
  IGetBpaReportsResponse,
  IGetBpaZonesResponse,
} from '../types/bpa';
import { IBaseResponse } from '../types/request';
import { http } from './httpService';

const bpaHttp = http.extend({ prefixUrl: `${apiBaseUrl}/admin/bpa` });

export const getBpaZonesService = async () => {
  const response = await bpaHttp.get('zone').json<IGetBpaZonesResponse>();

  return response;
};

export const getBpaProvidersService = async () => {
  const response = await bpaHttp.get('provider').json<IGetBpaProvidersResponse>();

  return response;
};

export const getBpaReportsService = async () => {
  const response = await bpaHttp.get('report').json<IGetBpaReportsResponse>();

  return response;
};

export const createBpaZoneService = async (data: ICreateBpaZonePayload) => {
  const form = new FormData();

  form.append('geojson', data.geojson);
  form.append('name', data.name);

  data.description && form.append('description', data.description);

  const response = await bpaHttp.post('zone/create', { body: form }).json<ICreateBpaZoneResponse>();

  return response.data;
};

export const updateBpaZoneService = async (id: string, data: Partial<ICreateBpaZonePayload>) => {
  const form = new FormData();

  data.geojson && form.append('geojson', data.geojson);
  data.name && form.append('name', data.name);
  data.description && form.append('description', data.description);

  const response = await bpaHttp
    .patch(`zone/${id}/update`, { body: form })
    .json<ICreateBpaZoneResponse>();

  return response.data;
};

export const createBpaProviderService = async (data: ICreateBpaProviderPayload) => {
  const response = await bpaHttp
    .post('provider/create', { json: data })
    .json<ICreateBpaProviderResponse>();

  return response.data;
};

export const updateBpaProviderService = async (
  id: string,
  data: Partial<ICreateBpaProviderPayload>
) => {
  const response = await bpaHttp
    .patch(`provider/${id}/update`, { json: data })
    .json<ICreateBpaProviderResponse>();

  return response.data;
};

export const createBpaReportService = async (data: ICreatBpaReportPayload) => {
  const form = new FormData();

  data.zoneIds.forEach((zoneId) => {
    form.append('zoneIds', zoneId);
  });
  form.append('providerId', data.providerId);
  form.append('publishDate', data.publishDate.toISOString());
  form.append('validUntilDate', data.validUntilDate.toISOString());
  form.append('pdf', data.pdf);

  const response = await bpaHttp
    .post('report/create', { body: form })
    .json<ICreateBpaReportResponse>();

  return response.data;
};

export const updateBpaReportService = async (id: string, data: Partial<ICreatBpaReportPayload>) => {
  const form = new FormData();

  data.zoneIds?.forEach((zoneId) => {
    form.append('zoneIds', zoneId);
  });
  data.providerId && form.append('providerId', data.providerId);
  data.publishDate && form.append('publishDate', data.publishDate.toISOString());
  data.validUntilDate && form.append('validUntilDate', data.validUntilDate.toISOString());
  data.pdf && form.append('pdf', data.pdf);

  const response = await bpaHttp
    .post(`bpa/${id}/update`, { body: form })
    .json<ICreateBpaReportResponse>();

  return response.data;
};

export const deleteBpaReportService = async (id: string) => {
  const response = await bpaHttp.delete(`report/${id}/delete`).json<IBaseResponse>();

  return response;
};

import { apiBaseUrl } from '../config/environment';
import { IPolygonGeometry } from '../types/geometry';
import { IBaseResponse } from '../types/request';
import {
  IBulkCreateWaypointResponse,
  ICreateWaypointPayload,
  IGetWaypointResponse,
  IGetWaypointsResponse,
} from '../types/waypoint';
import { http } from './httpService';

const waypointHttp = http.extend({ prefixUrl: `${apiBaseUrl}/admin/waypoint` });

export const waypointsByBoundingBox = async (boundingBox: IPolygonGeometry) => {
  const response = await waypointHttp
    .post('by-bounding-box', { json: { boundingBox } })
    .json<IGetWaypointsResponse>();

  return response;
};

export const getWaypointByIdService = async (id: string) => {
  const response = await waypointHttp.get(id).json<IGetWaypointResponse>();

  return response;
};

export const createWaypointService = async (data: ICreateWaypointPayload) => {
  const response = await waypointHttp.post('create', { json: data }).json<IGetWaypointResponse>();

  return response.data;
};

export const createWaypointBulkService = async (data: { gpx: File; ignoreDuplicates: boolean }) => {
  const form = new FormData();

  form.append('gpx', data.gpx);

  const response = await waypointHttp
    .post('create-bulk', { searchParams: { ignoreDuplicates: data.ignoreDuplicates }, body: form })
    .json<IBulkCreateWaypointResponse>();

  return response.data;
};

export const updateWaypointService = async (id: string, data: Partial<ICreateWaypointPayload>) => {
  const response = await waypointHttp
    .patch(`${id}/update`, { json: data })
    .json<IGetWaypointResponse>();

  return response;
};

export const deleteWaypointService = async (id: string) => {
  const response = await waypointHttp.delete(id).json<IBaseResponse>();

  return response;
};

import {
  ICreateExpeditionPayload,
  IGetExpeditionResult,
  IGetExpeditionsResult,
} from '../types/expedition';
import { http } from './httpService';

export const getExpeditionsService = async () => {
  const response = await http.get<IGetExpeditionsResult>('expedition');

  return response.data;
};

export const createExpeditionService = async (data: ICreateExpeditionPayload, gpxFile: File) => {
  const form = new FormData();

  form.append('gpx', gpxFile);

  Object.keys(data).forEach((key) => {
    const value = data[key as keyof ICreateExpeditionPayload];

    if (value) {
      form.append(key, value.toString());
    }
  });

  const response = await http.post<IGetExpeditionResult>('expedition/create', form);

  return response.data;
};

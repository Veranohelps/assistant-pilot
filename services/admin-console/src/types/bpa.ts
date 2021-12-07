import { IPolygonGeometry } from './geometry';
import { IBaseResponse } from './request';

export interface IBpaProvider {
  id: string;
  name: string;
  description: string;
  url: string;
  logoUrl: string | null;
  reportCount: number;
  disabled: boolean;
}

export interface IBpaZone {
  id: string;
  name: string;
  description: string | null;
  coordinate: IPolygonGeometry;
  reportCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBpaReport {
  id: string;
  providerId: string;
  zoneIds: string[];
  publishDateTime: Date;
  validUntilDateTime: Date;
  url: string;
}

export interface IBpaReportFull extends IBpaReport {
  zones?: IBpaZone[];
  provider?: IBpaProvider;
}

export interface IGetBpaZonesResponse extends IBaseResponse {
  data: { zones: IBpaZone[] };
}

export interface IGetBpaReportsResponse extends IBaseResponse {
  data: { reports: IBpaReportFull[] };
}

export interface IGetBpaProvidersResponse extends IBaseResponse {
  data: { providers: IBpaProvider[] };
}

export interface ICreateBpaProviderPayload {
  name: string;
  description: string;
  url: string;
}

export interface ICreateBpaProviderResponse extends IBaseResponse {
  data: { provider: IBpaProvider };
}

export interface ICreateBpaZonePayload {
  name: string;
  description?: string | null;
  geojson: File;
}

export interface ICreateBpaZoneResponse extends IBaseResponse {
  data: { zone: IBpaZone };
}

export interface ICreatBpaReportPayload {
  zoneIds: string[];
  providerId: string;
  publishDateTime: Date;
  validUntilDateTime: Date;
  pdf: File;
}

export interface ICreateBpaReportResponse extends IBaseResponse {
  data: { report: IBpaReport };
}

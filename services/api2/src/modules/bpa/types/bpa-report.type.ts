import { IBpaProvider } from './bpa-provider.type';
import { IBpaZone } from './bpa-zone.type';

export interface IBpaReport {
  id: string;
  providerId: string;
  zoneIds: string[];
  publishDate: Date;
  validUntilDate: Date;
  resourceUrl: string;
}

export interface IBpaReportFull extends IBpaReport {
  zones?: IBpaZone[];
  provider?: IBpaProvider;
}

export interface ICreateBpaReport {
  providerId: string;
  zoneIds: string[];
  publishDate: Date;
  validUntilDate: Date;
  resourceUrl: string;
}

export interface ICreateBpaReportDTO {
  zoneIds: string[];
  providerId: string;
  publishDate: Date;
  validUntilDate: Date;
}

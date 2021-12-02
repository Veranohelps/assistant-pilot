import { IBpaProvider } from './bpa-provider.type';
import { IBpaZone } from './bpa-zone.type';

export interface IBpaReport {
  id: string;
  zoneId: string;
  providerId: string;
  publishDate: Date;
  validUntilDate: Date;
  resourceUrl: string;
}

export interface IBpaReportFull extends IBpaReport {
  zone?: IBpaZone;
  provider?: IBpaProvider;
}

export interface ICreateBpaReport {
  zoneId: string;
  providerId: string;
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

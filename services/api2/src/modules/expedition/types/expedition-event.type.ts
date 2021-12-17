import { Knex } from 'knex';
import { IPointGeometry } from '../../common/types/geojson.type';
import { IDefaultMeta } from '../../database/types/database.type';

export enum EExpeditionUserEventType {
  LOCATION = 'location',
  NETWORK = 'network',
  PING = 'ping',
  ERROR = 'error',
  START = 'start',
  FINISH = 'finish',
}

export interface IExpeditionUserEventType {
  id: EExpeditionUserEventType;
  name: string;
  description: string;
}

export interface IDataBaseExpeditionUserEvent {
  id: string;
  expeditionId: string;
  userId: string;
  type: EExpeditionUserEventType;
  dateTime: Date;
  coordinate?: IPointGeometry;
  meta: IDefaultMeta;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICreateDataBaseExpeditionUserEvent {
  expeditionId: string;
  userId: string;
  type: EExpeditionUserEventType;
  dateTime: Date;
  coordinate?: Knex.Raw;
  meta: IDefaultMeta;
}
export interface IExpeditionUserEventData {
  type: EExpeditionUserEventType;
  dateTime: Date;
  coordinates?: [number, number, number | null];
  network?: boolean;
  message?: string;
}
export interface IExpeditionUserEventDTO {
  data: IExpeditionUserEventData[];
}

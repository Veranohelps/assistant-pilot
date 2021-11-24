import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { IExpedition } from '../../types/expedition.type';

export enum EExpeditionEvents {
  CREATE_EXPEDITION = 'EXPEDITION.CREATE_EXPEDITION',
  DELETE_EXPEDITIONS = 'EXPEDITION.DELETE_EXPEDITIONS',
}

export interface ICreateExpeditionEvent {
  tx: TransactionManager;
  expedition: IExpedition;
  userId?: string | null;
}

export interface IDeleteExpeditionsEvent {
  tx: TransactionManager;
  expeditions: IExpedition[];
  userId?: string | null;
}

export interface IExpeditionEventMappings {
  [EExpeditionEvents.CREATE_EXPEDITION]: ICreateExpeditionEvent;
  [EExpeditionEvents.DELETE_EXPEDITIONS]: IDeleteExpeditionsEvent;
}

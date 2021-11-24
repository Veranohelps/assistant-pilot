import { TransactionManager } from '../../../common/utilities/transaction-manager';
import { IUser } from '../../types/user.type';

export enum EUserEvents {
  DELETE_USER = 'USER.DELETE_USER',
}

export interface IDeleteUserEvent {
  tx: TransactionManager;
  user: IUser;
}

export interface IUserEventMappings {
  [EUserEvents.DELETE_USER]: IDeleteUserEvent;
}

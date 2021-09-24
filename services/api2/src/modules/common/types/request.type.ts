import { Request } from 'express';
import { IJWTPayload } from '../../auth/types/jwt.types';
import { IUser } from '../../user/types/user.type';
import { TransactionManager } from '../utilities/transaction-manager';

export interface IRequestUser {
  jwtPayload: IJWTPayload;
  userData: IUser;
}

export interface IRCtx {
  tx?: TransactionManager;
  user?: IRequestUser;
}

export interface IAppRequest extends Request {
  rctx: IRCtx;
}

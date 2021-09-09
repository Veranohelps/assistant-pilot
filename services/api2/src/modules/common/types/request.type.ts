import { Request } from 'express';
import { TransactionManager } from '../utilities/transaction-manager';

export interface IRCtx {
  tx?: TransactionManager;
}

export interface IAppRequest extends Request {
  rctx: IRCtx;
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequest } from '../utilities/get-request';
import { TransactionManager } from '../utilities/transaction-manager';

export const Tx = createParamDecorator(async (_, context: ExecutionContext) => {
  const tx = new TransactionManager();

  await tx.init();

  getRequest(context).rctx.tx = tx;

  return tx;
});

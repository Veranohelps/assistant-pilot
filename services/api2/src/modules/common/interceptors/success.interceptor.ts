import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getRequest } from '../utilities/get-request';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = getRequest(context);

    req.rctx = req.rctx ?? {};

    return next
      .handle()
      .pipe()
      .pipe(
        map(async (res) => {
          const { tx } = req.rctx;

          if (tx) {
            await tx.commit();
          }

          return res;
        }),
      );
  }
}

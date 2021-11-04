import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseExceptionFilter } from './filters/database.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { JoiExceptionFilter } from './filters/joi-exception.filter';
import { ErrorInterceptor } from './interceptors/error-handler.interceptor';
import { SuccessInterceptor } from './interceptors/success.interceptor';
import { LoaderService } from './services/loader.service';
import { StrapiService } from './services/strapi.service';
import { GcpService } from './services/gcp.service';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: JoiExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    LoaderService,
    StrapiService,
    GcpService,
  ],
  exports: [LoaderService, StrapiService, GcpService],
})
export class CommonModule {}

import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseExceptionFilter } from './filters/database.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { JoiExceptionFilter } from './filters/joi-exception.filter';
import { ErrorInterceptor } from './interceptors/error-handler.interceptor';
import { SuccessInterceptor } from './interceptors/success.interceptor';
import { EventService } from './services/event.service';
import { GcpService } from './services/gcp.service';
import { LoaderService } from './services/loader.service';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
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
    GcpService,
    EventService,
  ],
  exports: [LoaderService, GcpService, EventService],
})
export class CommonModule {}

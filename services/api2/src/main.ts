import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './modules/app.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('NODE_ENV') === 'local' ? /localhost/ : /dersu/,
  });
  app.use('/graphql', graphqlUploadExpress());
  app.use(morgan('dev'));

  await app.listen(configService.get('APP_PORT') as string);
}

bootstrap();

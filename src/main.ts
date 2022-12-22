import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ExceptionThrownFilter } from './filters/exception-thrown.filter';

async function bootstrap() {
  const logLevels = process.env.LOG_LEVEL.split(',');

  const app = await NestFactory.create(AppModule, {
    logger: logLevels as LogLevel[],
  });

  const config = app.get(ConfigService);
  const port = config.get('PORT');
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new ExceptionThrownFilter(httpAdapterHost));

  app.enableCors();

  await app.listen(port);
}

bootstrap();

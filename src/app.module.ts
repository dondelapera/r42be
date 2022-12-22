import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AccountsModule } from './accounts/accounts.module';
import { ActivitiesModule } from './activities/activities.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import envValidation from './config/env.validation';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { StravaModule } from './strava/strava.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      // FYI: Limit 10 request from same IP in 1 minute
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AccountsModule,
    ActivitiesModule,
    StravaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}

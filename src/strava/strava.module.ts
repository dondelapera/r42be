import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Account, AccountSchema } from 'src/schemas/account.schema';
import { Activity, ActivitySchema } from 'src/schemas/activity.schema';
import { StravaController } from './strava.controller';
import { StravaService } from './strava.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: configService.get('STRAVA_BASE_URL'),
        };
      },
    }),
  ],
  providers: [StravaService],
  exports: [StravaService],
  controllers: [StravaController],
})
export class StravaModule {}

import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/response-transform.interceptor';
import { StravaToken } from '../decorators/strava-token.decorator';
import { StravaService } from './strava.service';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('strava')
export class StravaController {
  constructor(
    private readonly configService: ConfigService,
    private readonly stravaService: StravaService,
    private readonly authService: AuthService,
  ) {}

  @Post('connect')
  async connect(@Body('code') code: string) {
    const params = {
      code,
      client_id: this.configService.get('STRAVA_CLIENT_ID'),
      client_secret: this.configService.get('STRAVA_CLIENT_SECRET'),
      grant_type: 'authorization_code',
    };

    const data = await this.stravaService.auth(params);

    await this.stravaService.upsertAccount({
      id: _.get(data, 'athlete.id'),
      username: _.get(data, 'athlete.username'),
      firstname: _.get(data, 'athlete.firstname'),
      lastname: _.get(data, 'athlete.lastname'),
      country: _.get(data, 'athlete.country'),
    });

    return {
      access_token: this.authService.generateToken(data),
      athlete_id: _.get(data, 'athlete.id'),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('disconnect')
  disconnect(@StravaToken() stravaToken) {
    return this.stravaService.deAuth(stravaToken.access_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async sync(@StravaToken() stravaToken) {
    const activities = await this.stravaService.getActivitiesLast3Days(
      stravaToken.access_token,
    );

    return this.stravaService.upsertActivityBulkWrite(
      stravaToken.user_id,
      activities,
    );
  }
}

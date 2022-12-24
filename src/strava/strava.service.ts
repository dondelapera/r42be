import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Account, AccountDocument } from 'src/schemas/account.schema';
import { Activity, ActivityDocument } from 'src/schemas/activity.schema';
import { AuthDto } from './dto/auth.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class StravaService {
  constructor(
    private httpService: HttpService,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async auth(authDto: AuthDto) {
    const result = await firstValueFrom(
      this.httpService.post('/api/v3/oauth/token', null, {
        params: authDto,
      }),
    );

    return result.data;
  }

  async deAuth(accessToken: string) {
    const result = await firstValueFrom(
      this.httpService.post('/oauth/deauthorize', null, {
        params: { access_token: accessToken },
      }),
    );

    return result.data;
  }

  async getActivitiesLast3Days(accessToken: string) {
    const daysAgo = moment().subtract(3, 'days').unix();
    const result = await firstValueFrom(
      this.httpService.get('/api/v3/activities', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          after: daysAgo,
        },
      }),
    );

    return result.data;
  }

  upsertActivityBulkWrite(
    userId: string,
    createActivityDto: CreateActivityDto[],
  ) {
    return this.activityModel.bulkWrite(
      createActivityDto.map((activity) => {
        return {
          updateOne: {
            filter: { id: activity.id },
            update: { $set: { ...activity, user_id: userId } },
            upsert: true,
          },
        };
      }),
    );
  }

  upsertAccount(createAccountDto: CreateAccountDto) {
    return new Promise((resolve, reject) => {
      this.accountModel.findOneAndUpdate(
        {
          id: createAccountDto.id,
        },
        { $set: createAccountDto },
        { upsert: true, new: true },
        (err, data) => {
          if (err) {
            return reject(err);
          }

          resolve(data);
        },
      );
    });
  }
}

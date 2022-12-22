import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from 'src/schemas/activity.schema';
import { FindAllActivityDto } from './dto/find-all-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  findAll(findAllActivityDto: FindAllActivityDto) {
    return this.activityModel
      .find({
        ...(findAllActivityDto.type && { type: findAllActivityDto.type }),
        ...(findAllActivityDto.user_id && {
          user_id: findAllActivityDto.user_id,
        }),
      })
      .sort({ start_date: -1 });
  }

  findOne(id: string) {
    return this.activityModel.findOne({ id });
  }

  remove(id: string) {
    return this.activityModel.remove({ id });
  }
}

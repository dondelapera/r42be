import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from 'src/schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private activityModel: Model<AccountDocument>,
  ) {}

  findAll() {
    return this.activityModel.find();
  }

  findOne(id: string) {
    return this.activityModel.findOne({ id });
  }
}

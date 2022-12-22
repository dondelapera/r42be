import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema()
export class Activity {
  @Prop()
  id: string;

  @Prop()
  user_id: string;

  @Prop()
  name: string;

  @Prop({ type: Object })
  athlete: object;

  @Prop()
  type: string;

  @Prop()
  sport_type: string;

  @Prop()
  start_date: string;

  @Prop()
  start_date_local: string;

  @Prop()
  timezone: string;

  @Prop({ type: Object })
  map: object;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

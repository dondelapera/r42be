export class CreateActivityDto {
  id: string;
  user_id: string;
  name: string;
  athlete: object;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  map: object;
}

import { IsNumber } from 'class-validator';

export class AddUserGroup {
  @IsNumber()
  user_id: number;

  @IsNumber()
  group_id: number;
}

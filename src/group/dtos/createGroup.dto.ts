import { IsNumber, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  group_name: string;

  @IsNumber()
  owner_id: number;

  @IsNumber()
  project_id: number;
}

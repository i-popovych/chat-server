import { IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  readonly project_name: string;
}

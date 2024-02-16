import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'My Project',
  })
  @IsString()
  readonly project_name: string;
}

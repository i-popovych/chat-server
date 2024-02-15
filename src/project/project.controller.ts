import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ProjectService } from './project.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Please provide valid input.',
  })
  @Post()
  @HttpCode(201)
  createProject(@Req() request: any, @Body() dto: CreateProjectDto) {
    const { project_name } = dto;
    const { sub } = request.user;

    return this.projectService.createProject(project_name, sub);
  }
}

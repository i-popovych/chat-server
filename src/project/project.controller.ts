import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { ProjectService } from './project.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto';
import { User } from '../common';
import { JwtPayloadEnum } from '../auth/enums/jwt-payload.enum';

@ApiTags('Project')
@Controller('projects')
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
  createProject(
    @User(JwtPayloadEnum.sub) userId: any,
    @Body() dto: CreateProjectDto,
  ) {
    const { project_name } = dto;

    return this.projectService.createProject(project_name, userId);
  }

  @Get('my-projects')
  getAllUserProjects(@Req() request: any) {
    const { sub } = request.user;

    return this.projectService.getUsersProjects(sub);
  }
}

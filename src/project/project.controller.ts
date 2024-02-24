import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ProjectService } from './project.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayloadEnum } from '../auth/enums/jwt-payload.enum';
import { User } from '../common';
import { CreateProjectDto } from './dto';

@ApiTags('Project')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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

  @Get('join/:projectId')
  inviteToProject(
    @Param('projectId') projectId: string,
    @User(JwtPayloadEnum.sub) userId: number,
  ) {
    return this.projectService.addUserToProject(projectId, userId);
  }
}

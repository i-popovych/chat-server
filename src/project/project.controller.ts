import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProjectService } from './project.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayloadEnum } from '../auth/enums/jwt-payload.enum';
import { User } from '../common';
import { CreateProjectDto } from './dto';

@ApiTags('project')
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
  @ApiOperation({ summary: 'Invite a user to join a project' })
  @ApiResponse({
    status: 200,
    description: 'User has been added to the project successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found.',
  })
  @Get('join/:projectId')
  inviteToProject(
    @Param('projectId') projectId: string,
    @User(JwtPayloadEnum.sub) userId: number,
  ) {
    return this.projectService.addUserToProject(projectId, userId);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get all users in a project' })
  @ApiResponse({
    status: 200,
    description: 'List of all users in the project.',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found.',
  })
  @Get(':id/users')
  getProjectUsers(@Param('id', ParseIntPipe) projectId: number) {
    return this.projectService.getAllProjectUsers(projectId);
  }
}

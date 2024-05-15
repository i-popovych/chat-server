import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddUserGroup, CreateGroupDto } from './dto';
import { GroupService } from './group.service';
import { User } from '../common';
import { JwtPayloadEnum } from '../auth/enums/jwt-payload.enum';

@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ status: 201, description: 'The created group' })
  create(
    @Body() dto: CreateGroupDto,
    @User(JwtPayloadEnum.sub) userId: number,
  ) {
    return this.groupService.createGroup(
      dto.group_name,
      userId,
      dto.project_id,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all groups for a specific project' })
  @ApiResponse({ status: 200, description: 'List of project groups' })
  getProjectGroups(
    @User(JwtPayloadEnum.sub) userId: number,
    @Query('project') projectId: number,
  ) {
    return this.groupService.getAllProjectGroup(userId, projectId);
  }

  @Get('user')
  @ApiOperation({
    summary:
      'Retrieve all groups associated with a user within a specific project',
  })
  @ApiResponse({ status: 200, description: 'List of user groups' })
  getUserGroup(
    @User(JwtPayloadEnum.sub) userId: number,
    @Query('project') projectId: number,
  ) {
    return this.groupService.getAllUserGroup(userId, projectId);
  }

  @Post('add-user')
  @ApiOperation({ summary: 'Add a user to a specific group' })
  @ApiBody({ type: AddUserGroup })
  @ApiResponse({
    status: 200,
    description: 'The updated group with new user added',
  })
  addUser(@Body() dto: AddUserGroup) {
    return this.groupService.addUserToGroup(dto.group_id, dto.user_id);
  }

  @Get(':groupId/users')
  @ApiOperation({ summary: 'Get all users of a specific group' })
  @ApiResponse({ status: 200, description: 'List of users in the group' })
  getGroupUsers(@Param('groupId') groupId: string) {
    return this.groupService.getGroupUsers(Number(groupId));
  }

  @Post('invite/:groupName')
  @ApiOperation({ summary: 'Invite a user to join a group by group name' })
  @ApiBody({ required: true })
  @ApiResponse({ status: 200, description: 'User invited to the group' })
  inviteUserToGroup(
    @Param('groupName') groupName: string,
    @User(JwtPayloadEnum.sub) userId: number,
    @Body() dto: { project_id: number },
  ) {
    return this.groupService.addUserByGroupName(
      userId,
      groupName,
      dto.project_id,
    );
  }
}

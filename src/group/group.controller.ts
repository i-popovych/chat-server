import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddUserGroup, CreateGroupDto } from './dtos';
import { GroupService } from './group.service';

@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @ApiOperation({ summary: 'Create a group' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ status: 201, description: 'The created group' })
  @Post()
  create(@Body() dto: CreateGroupDto) {
    return this.groupService.createGroup(
      dto.group_name,
      dto.owner_id,
      dto.project_id,
    );
  }

  @ApiOperation({ summary: 'Add a user to a group' })
  @ApiBody({ type: AddUserGroup })
  @ApiResponse({ status: 200, description: 'The updated group' })
  @Post('add-user')
  addUser(@Body() dto: AddUserGroup) {
    return this.groupService.addUserToGroup(dto.group_id, dto.user_id);
  }

  @ApiOperation({ summary: 'Get users of a group' })
  @ApiResponse({ status: 200, description: 'The group users' })
  @Get(':groupId/users')
  getGroupUsers(@Param('groupId') groupId: string) {
    return this.groupService.getGroupUsers(Number(groupId));
  }
}

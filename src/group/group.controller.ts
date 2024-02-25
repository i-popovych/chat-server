import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddUserGroup, CreateGroupDto } from './dto';
import { GroupService } from './group.service';
import { User } from '../common';
import { JwtPayloadEnum } from '../auth/enums/jwt-payload.enum';

@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @ApiOperation({ summary: 'Create a group' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ status: 201, description: 'The created group' })
  @Post()
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

  @Post('invite/:groupMame')
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

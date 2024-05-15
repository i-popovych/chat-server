import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Retrieve user profile' })
  @ApiResponse({ status: 200, description: 'Return user profile' })
  getProfile(@Req() request: any) {
    const { sub } = request.user;
    return this.userService.getUserById(sub);
  }

  @Get('my-projects')
  @ApiOperation({ summary: 'Get all projects associated with the user' })
  @ApiResponse({ status: 200, description: 'Return all user projects' })
  getAllUserProjects(@Req() request: any) {
    const { sub } = request.user;
    return this.userService.getUsersProjects(sub);
  }

  @Put('/avatar')
  @ApiOperation({ summary: 'Update user avatar' })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
  updateAvatar(@Body() body: { avatarName: string }) {
    const avatarName = body.avatarName;
    return this.userService.updateAvatar(avatarName);
  }
}

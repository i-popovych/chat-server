import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  getProfile(@Req() request: any) {
    const { sub } = request.user;
    return this.userService.getUserById(sub);
  }

  @Get('my-projects')
  getAllUserProjects(@Req() request: any) {
    const { sub } = request.user;

    return this.userService.getUsersProjects(sub);
  }

  @Put('/avatar')
  updateAvatar(@Body() body: any) {
    const avatarName = body.avatarName;

    return this.userService.updateAvatar(avatarName);
  }
}

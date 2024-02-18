import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('my-projects')
  getAllUserProjects(@Req() request: any) {
    const { sub } = request.user;

    return this.userService.getUsersProjects(sub);
  }
}

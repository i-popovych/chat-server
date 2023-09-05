import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AtGuard, RtGuard } from './guards';
import { JwtPayload } from './types';

@Controller('auth')
@ApiTags('Authorization and authentication')
export class AuthController {
  constructor(private authSevice: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  // @ApiOkResponse({type: Tokens})
  @Post('local/signin')
  signInLocal(@Body() dto: AuthDto) {
    return this.authSevice.signInLocal(dto);
  }

  @ApiOperation({ summary: 'Sign up' })
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signUpLocal(@Body() dto: AuthDto) {
    return this.authSevice.signUpLocal(dto);
  }

  @ApiOperation({ summary: 'Logout' })
  @UseGuards(AtGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    const user = req.user as JwtPayload;
    this.authSevice.logout(user.userId);
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @UseGuards(RtGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.authSevice.refresh(user.userId, req.cookies.refreshToken);
  }
}

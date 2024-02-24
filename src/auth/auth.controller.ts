import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public, User } from 'src/common';
import { AuthService } from './auth.service';
import { Cookies } from './decorators';
import { AuthDto } from './dto';
import { AuthPayload } from './enums';
import { JwtPayloadEnum } from './enums/jwt-payload.enum';
import { RtGuard } from './guards';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authorization and authentication')
export class AuthController {
  constructor(private authSevice: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  // @ApiOkResponse({type: Tokens})
  // todo: create decorator to response with cookie
  @Public()
  @Post('local/signin')
  async signInLocal(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const tokens = await this.authSevice.signInLocal(dto);
    res.cookie(AuthPayload.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
    });
    return tokens;
  }

  @ApiOperation({ summary: 'Sign up' })
  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: AuthDto,
  ) {
    const tokens = await this.authSevice.signUpLocal(dto);
    res.cookie(AuthPayload.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
    });
    return tokens;
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  logout(@User(JwtPayloadEnum.sub) userId: number) {
    this.authSevice.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @ApiOperation({ summary: 'Refresh tokens' })
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @User(JwtPayloadEnum.sub) userId: number,
    @Cookies(AuthPayload.REFRESH_TOKEN) refreshToken: string,
  ) {
    const tokens = await this.authSevice.refresh(userId, refreshToken);
    res.cookie(AuthPayload.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
    });
    return tokens;
  }
}

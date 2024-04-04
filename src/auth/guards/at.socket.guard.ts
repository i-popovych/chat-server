import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const accessToken = client.handshake.auth.token.split(' ')[1];

    const user = await this.jwtService.verifyAsync(accessToken, {
      secret: process.env.AUTHORIZATION_TOKEN_SECRET_KEY,
    });

    if (!user) return false;

    context.switchToHttp().getRequest().user = user;

    return true;
  }
}

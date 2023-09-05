import { UserService } from './../user/user.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens, JwtPayload } from './types';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { TokenModel } from './token.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(TokenModel) private tokenRepository: typeof TokenModel,
  ) {}

  async signInLocal(dto: AuthDto): Promise<Tokens> {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (!candidate)
      throw new ForbiddenException(
        'The user with the email address is not registered',
      );

    const isPassMatch = bcrypt.compare(dto.password, candidate.password);

    if (!isPassMatch)
      throw new ForbiddenException(
        'The user with the email address is not registered',
      );

    return await this.generateAndSetTokens(
      { userId: candidate.id, email: candidate.email },
      candidate.id,
    );
  }

  async signUpLocal(dto: AuthDto): Promise<Tokens> {
    const candidate = await this.userService.getUserByEmail(dto.email);

    if (candidate) {
      throw new BadRequestException('User with this email is alredy exist');
    }

    const hashPassward = await this.hashData(dto.password);
    const newUser = await this.userService.createUser(dto.email, hashPassward);

    return await this.generateAndSetTokens(
      { userId: newUser.id, email: newUser.email },
      newUser.id,
    );
  }

  async logout(userId: number) {
    await this.tokenRepository.destroy({
      where: { user_id: userId },
    });
  }

  async refresh(userId: number, rt: string): Promise<Tokens> {
    const token = await this.tokenRepository.findOne({
      where: { user_id: userId },
    });
    if (!token) {
      throw new ForbiddenException('Access denied');
    }

    const isCompare = bcrypt.compare(rt, token.hash_rt);

    if (!isCompare) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.userService.getUserById(userId);
    return await this.generateAndSetTokens(
      { userId: user.id, email: user.email },
      user.id,
    );
  }

  private async generateAndSetTokens(payload: JwtPayload, userId: number) {
    const tokens = await this.generateTokens(payload);
    await this.updateRtToken(userId, tokens.refreshToken);
    return tokens;
  }

  private async updateRtToken(userId: number, rtToken: string) {
    const userToken = await this.tokenRepository.findOne({
      where: { user_id: userId },
    });
    const hash_rt = await this.hashData(rtToken);

    if (userToken) {
      userToken.hash_rt = hash_rt;
      await userToken.save();
    } else {
      await this.tokenRepository.create({
        user_id: userId,
        hash_rt,
      });
    }
  }

  private async hashData(data: string, salt: number = 4) {
    return await bcrypt.hash(data, salt);
  }

  private async generateTokens(payload: JwtPayload): Promise<Tokens> {
    const authorizationToken = await this.getAuthorizationToken(payload);
    const refreshToken = await this.getRefreshToken(payload);

    return {
      authorizationToken,
      refreshToken,
    };
  }

  private async getAuthorizationToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(
      {
        ...payload,
      },
      {
        secret: process.env.AUTHORIZATION_TOKEN_SECRET_KEY,
        expiresIn: Number(process.env.REFRESH_TOKEN_LIFETIME),
      },
    );
  }

  private async getRefreshToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(
      {
        ...payload,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
        expiresIn: Number(process.env.AUTHORIZATON_TOKEN_LIFETIME),
      },
    );
  }
}

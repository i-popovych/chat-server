import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenModel } from 'src/auth/token.model';
import { UserModel } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([TokenModel, UserModel])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

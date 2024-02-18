import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenModel } from 'src/auth/token.model';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { GroupModel } from '../group/group.model';
import { GroupUserModel } from '../group/group-user.model';
import { ProjectUserModel } from '../project/project-user.model';
import { UserController } from './user.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      TokenModel,
      UserModel,
      GroupModel,
      GroupUserModel,
      ProjectUserModel,
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

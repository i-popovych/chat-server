import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectModule } from '../project/project.module';
import { UserModel } from '../user/user.model';
import { UserModule } from '../user/user.module';
import { GroupUserModel } from './group-user.model';
import { GroupController } from './group.controller';
import { GroupModel } from './group.model';
import { GroupService } from './group.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, GroupModel, GroupUserModel]),
    ProjectModule,
    UserModule,
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}

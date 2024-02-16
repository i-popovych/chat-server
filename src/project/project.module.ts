import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectModel } from './project.model';

import { GroupModel } from '../group/group.model';
import { UserModel } from '../user/user.model';
import { ProjectUserModel } from './project-user.model';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      ProjectModel,
      GroupModel,
      ProjectUserModel,
    ]),
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}

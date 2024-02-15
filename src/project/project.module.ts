import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectModel } from './project.model';

import { UserModel } from '../user/user.model';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel, ProjectModel])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}

import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupModel } from '../group/group.model';
import { MessageModel } from './message.model';

@Module({
  imports: [SequelizeModule.forFeature([GroupModel, MessageModel])],
  providers: [MessageService],
})
export class MessageModule {}

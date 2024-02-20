import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessageModel } from './message.model';
import { MessageService } from './message.service';

@Module({
  imports: [SequelizeModule.forFeature([MessageModel])],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

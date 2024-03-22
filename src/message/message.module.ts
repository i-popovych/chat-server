import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupModule } from '../group/group.module';
import { MessageController } from './message.controller';
import { MessageModel } from './message.model';
import { MessageService } from './message.service';
import { UserModel } from '../user/user.model';
import { FilesModule } from 'src/files/files.module';
import { FileModel } from 'src/message/file.model';

@Module({
  imports: [
    SequelizeModule.forFeature([MessageModel, UserModel, FileModel]),
    GroupModule,
    FilesModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

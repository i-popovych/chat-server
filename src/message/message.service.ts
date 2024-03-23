import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageModel } from './message.model';
import { InjectModel } from '@nestjs/sequelize';
import { GroupService } from '../group/group.service';
import { UserModel } from '../user/user.model';
import { SendFileItem } from 'src/getway/types/SendMessageBody.type';
import { FileModel } from 'src/message/file.model';
import { FilesService } from 'src/files/files.service';
import { CreateMessageDto } from 'src/message/dto/CreateMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(MessageModel)
    private readonly messageRepository: typeof MessageModel,
    @InjectModel(FileModel)
    private readonly fileRepository: typeof FileModel,
    private readonly groupService: GroupService,
    private readonly filesSerivce: FilesService,
  ) {}

  async createMessage(
    body: string,
    sender_id: number,
    group_id: number,
    files: SendFileItem[] | undefined,
  ): Promise<CreateMessageDto> {
    const message = await this.messageRepository.create({
      body,
      group_id,
      sender_id,
    });

    const uploadedFilesPath: FileModel[] = [];

    if (files && files.length) {
      for (const file of files) {
        const filePath = await this.filesSerivce.writeBufferFile(
          file.data,
          file.name.split('.').pop(),
        );

        const fileModel = await this.fileRepository.create({
          fileName: file.name,
          filePath,
          message_id: message.id,
        });

        uploadedFilesPath.push(fileModel.dataValues);
      }
    }

    return { message, files: uploadedFilesPath };
  }

  private async getMessagesByGroup(groupId: number) {
    const result = await this.messageRepository.findAll({
      where: { group_id: groupId },
      include: [UserModel, FileModel],
    });

    return result;
  }

  async getChatMessages(userId: number, groupId: number) {
    const isUserExistInGroup = await this.groupService.hasGroupUser(
      userId,
      groupId,
    );

    if (!isUserExistInGroup) {
      throw new NotFoundException('User does not exist in the group');
    }

    return await this.getMessagesByGroup(groupId);
  }
}

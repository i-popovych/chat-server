import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageModel } from './message.model';
import { InjectModel } from '@nestjs/sequelize';
import { GroupService } from '../group/group.service';
import { UserModel } from '../user/user.model';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(MessageModel)
    private readonly messageRepository: typeof MessageModel,
    private readonly groupService: GroupService,
  ) {}

  async createMessage(body: string, sender_id: number, group_id: number) {
    const message = await this.messageRepository.create({
      body,
      group_id,
      sender_id,
    });
    return message;
  }

  private async getMessagesByGroup(groupId: number) {
    const result = await this.messageRepository.findAll({
      where: { group_id: groupId },
      include: [UserModel],
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

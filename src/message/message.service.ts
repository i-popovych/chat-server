import { Injectable } from '@nestjs/common';
import { MessageModel } from './message.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(MessageModel)
    private readonly messageRepository: typeof MessageModel,
  ) {}

  async createMessage(body: string, sender_id: number, group_id: number) {
    const message = await this.messageRepository.create({
      body,
      group_id,
      sender_id,
    });
    return message;
  }
}

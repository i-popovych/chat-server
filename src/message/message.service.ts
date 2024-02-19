import { Injectable } from '@nestjs/common';
import { MessageModel } from './message.model';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: typeof MessageModel) {}

  async createMessage(body: string, sender_id: number, group_id: number) {
    const message = await this.messageRepository.create({
      body,
      group_id,
      sender_id,
    });
    return message;
  }
}

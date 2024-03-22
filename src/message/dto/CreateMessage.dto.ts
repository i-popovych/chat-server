import { MessageModel } from 'src/message/message.model';

export type CreateMessageDto = {
  message: MessageModel;
  filePath: string[];
};

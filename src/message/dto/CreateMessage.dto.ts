import { FileModel } from 'src/message/file.model';
import { MessageModel } from 'src/message/message.model';

export type CreateMessageDto = {
  message: MessageModel;
  files: FileModel[];
};

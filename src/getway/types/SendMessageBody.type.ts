export type SendMessageBody = {
  groupId: string;
  userId: string;
  content: string;
  files: SendFileItem[];
};

export type SendFileItem = {
  name: string;
  data: Buffer;
};

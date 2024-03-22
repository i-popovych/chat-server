import { UserService } from './../user/user.service';
import { MessageService } from './../message/message.service';
import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GroupService } from '../group/group.service';
import { Events } from './enums/events.enum';
import { SendMessageBody } from 'src/getway/types/SendMessageBody.type';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  allowEIO3: true,
  transports: ['websocket'],
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly groupService: GroupService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage(Events.ROOM_SET_CONNECT)
  async onRoomConnect(@MessageBody() body: any) {
    const { groupId, userId } = body;
    const group = await this.groupService.getGroupById(groupId);
    this.server.socketsJoin(String(group.id));

    this.server.to(String(group.id)).emit(Events.ROOM_GET_CONNECT, {
      msg: 'User connected',
      userId,
    });
  }

  @SubscribeMessage(Events.SET_NEW_MESSAGE)
  async onNewMessage(@MessageBody() body: SendMessageBody) {
    const { groupId, userId, content, files } = body;
    const res = await this.messageService.createMessage(
      content,
      +userId,
      +groupId,
      files,
    );

    const user = await this.userService.getUserById(+userId);

    const response = { ...res, users: user.dataValues };

    this.server.to(String(groupId)).emit(Events.GET_MESSAGE, {
      msg: 'New Message',
      content: response,
    });
  }
}

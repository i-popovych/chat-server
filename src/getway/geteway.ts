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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly groupService: GroupService,
    private readonly messageService: MessageService,
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
  async onNewMessage(@MessageBody() body: any) {
    const { groupId, userId, content } = body;
    const message = await this.messageService.createMessage(
      content,
      groupId,
      userId,
    );

    this.server.to(String(groupId)).emit(Events.GET_MESSAGE, {
      msg: 'New Message',
      content: message.body,
    });
  }
}

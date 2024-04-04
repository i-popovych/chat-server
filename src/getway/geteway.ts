import { UserService } from './../user/user.service';
import { MessageService } from './../message/message.service';
import { OnModuleInit, UseGuards } from '@nestjs/common';
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
import { WsGuard } from 'src/auth/guards/at.socket.guard';
import { WsUser } from 'src/common/decorators/wsUser.decorator';
import { JwtPayloadEnum } from 'src/auth/enums/jwt-payload.enum';

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

  @UseGuards(WsGuard)
  @SubscribeMessage(Events.ROOM_SET_CONNECT)
  async onRoomConnect(
    @MessageBody('groupId') groupId: string,
    @WsUser(JwtPayloadEnum.sub) userId: string,
  ) {
    const group = await this.groupService.getGroupById(Number(groupId));
    this.server.socketsJoin(String(group.id));

    this.server.to(String(group.id)).emit(Events.ROOM_GET_CONNECT, {
      msg: 'User connected',
      userId,
    });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(Events.SET_NEW_MESSAGE)
  async onNewMessage(
    @MessageBody() body: SendMessageBody,
    @WsUser(JwtPayloadEnum.sub) userId: string,
  ) {
    const { groupId, content, files } = body;
    const message = await this.messageService.createMessage(
      content,
      Number(userId),
      Number(groupId),
      files,
    );

    const user = await this.userService.getUserById(Number(userId));

    const response = { ...message, users: user.dataValues };

    this.server.to(String(groupId)).emit(Events.GET_MESSAGE, response);
  }
}

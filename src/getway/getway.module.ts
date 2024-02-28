import { Module } from '@nestjs/common';
import { GroupModule } from '../group/group.module';
import { MyGateway } from './geteway';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [GroupModule, MessageModule, UserModule],
  providers: [MyGateway],
})
export class GatewayModule {}

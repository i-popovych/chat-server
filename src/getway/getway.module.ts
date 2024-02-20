import { Module } from '@nestjs/common';
import { GroupModule } from '../group/group.module';
import { MyGateway } from './geteway';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [GroupModule, MessageModule],
  providers: [MyGateway],
})
export class GatewayModule {}

import { Module } from '@nestjs/common';

import { GroupModule } from '../group/group.module';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';
import { MyGateway } from './geteway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [GroupModule, MessageModule, UserModule, JwtModule.register({})],
  providers: [MyGateway],
})
export class GatewayModule {}

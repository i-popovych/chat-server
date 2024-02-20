import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/guards';
import { TokenModel } from './auth/token.model';
import { GatewayModule } from './getway/getway.module';
import { GroupUserModel } from './group/group-user.model';
import { GroupModel } from './group/group.model';
import { GroupModule } from './group/group.module';
import { ProjectUserModel } from './project/project-user.model';
import { ProjectModel } from './project/project.model';
import { ProjectModule } from './project/project.module';
import { UserModel } from './user/user.model';
import { UserModule } from './user/user.module';
import { MessageModel } from './message/message.model';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [
        UserModel,
        TokenModel,
        ProjectModel,
        GroupModel,
        ProjectUserModel,
        GroupUserModel,
        MessageModel,
      ],
      autoLoadModels: true,
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    GroupModule,
    GatewayModule,
    MessageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}

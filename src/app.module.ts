import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModel } from './user/user.model';
import { TokenModel } from './auth/token.model';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';
import { ProjectModule } from './project/project.module';
import { ProjectModel } from './project/project.model';
import { GroupModule } from './group/group.module';
import { GroupModel } from './group/group.model';
import { ProjectUserModel } from './project/project-user.model';
import { GroupUserModel } from './group/group-user.model';
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
      ],
      autoLoadModels: true,
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    GroupModule,
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

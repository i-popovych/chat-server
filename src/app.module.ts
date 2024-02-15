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
      models: [UserModel, TokenModel, ProjectModel],
      autoLoadModels: true,
    }),
    UserModule,
    AuthModule,
    ProjectModule,
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

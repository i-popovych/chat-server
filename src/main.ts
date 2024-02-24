import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from './common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('File hosting api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(Number(process.env.PORT) | 7000);
}
bootstrap();

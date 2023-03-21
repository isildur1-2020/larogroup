import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const PORT = 8080;
  const PREFIX = '/v1.0/api';
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix(PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(PORT);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // 🔴 إعـداد وصـف الـ APIs الخـاصة بك 🔴
  const config = new DocumentBuilder()
    .setTitle('LensBot Ecosystem API')
    .setDescription('The official API documentation for LensBot packages, sessions, and users.')
    .setVersion('1.0')
    .addBearerAuth() // إذا كنت تستخدم حماية الـ JWT Token لاحقاً
    .build();

  app.enableCors({
    origin: 'http://localhost:5173', // السماح لمشروع الـ React الخاص بك فقط
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: 'https://arm-assessment-front-xc63d.ondigitalocean.app/', // Your Next.js frontend URL
    // origin: 'http://localhost:3000', // Your Next.js frontend URL
    
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not defined in DTO
      forbidNonWhitelisted: true, // Throw error if extra properties are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  await app.listen(8080); // Backend runs on port 5000
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodExceptionFilter } from './shared/zod-exception.filter';
import { slowdownMiddleware } from './shared/slowdown.middleware';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // Exception filter for zod
  app.useGlobalFilters(new ZodExceptionFilter());

  // Enable CORS
  app.enableCors();

  // Enable slowdown
  app.use(slowdownMiddleware);

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}

// Start the application
bootstrap().catch(console.error);

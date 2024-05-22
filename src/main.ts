import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// import * as dotenv from 'dotenv';


// dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  // Enable CORS

  const corsOptions: CorsOptions = {
    origin: process.env.CLIENT_URL, // Update with your React app URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);

  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  
  app.use(cookieParser());
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}


bootstrap();


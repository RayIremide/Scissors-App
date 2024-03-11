import { Module } from '@nestjs/common';
import { AppController,UrlController,ShortURLController ,UrlProfileController,ShortURLProfileController} from './app.controller';
import { AppService, UrlService,UrlProfileService} from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { UrlMapping, UrlMappingSchema } from './database/url-mapping.schema';
import { UrlMappingModel } from './database/url-mapping.model';
import * as dotenv from 'dotenv';
dotenv.config();
import { AuthModule } from './Authentication/authModule';
import { QrCodeService } from './qr-code.util';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: UrlMapping.name, schema: UrlMappingSchema }]),
    DatabaseModule, AuthModule
  ],
  controllers: [AppController,UrlController,ShortURLController,UrlProfileController,ShortURLProfileController],
  providers: [AppService,UrlService,UrlMappingModel,QrCodeService,UrlProfileService],
})


export class AppModule {}

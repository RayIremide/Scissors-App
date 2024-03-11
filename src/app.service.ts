import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlMappingModel } from './database/url-mapping.model';
import { UrlMapping } from './database/url-mapping.schema';
import { CreateUrlDto } from './dto/create-url.dto';
import * as shortid from 'shortid';
import { Response } from 'express';




@Injectable()
export class AppService {
  renderIndex(response: Response): void {
    response.render('index');
  }
}



@Injectable()
export class UrlService {
  constructor(@InjectModel(UrlMapping.name) private readonly urlModel: Model<UrlMapping>) {}

  async create(createUrlDto: CreateUrlDto): Promise<UrlMapping> {
    const shortId = shortid.generate(); // Generate short ID
    const completeShortUrl = `http://localhost:3000/urls/${shortId}`; // Complete short URL
    const createdUrl = new this.urlModel({ ...createUrlDto, shortId: completeShortUrl });
    await createdUrl.save();
    return createdUrl;
  }

  async findByShortUrl(shortUrl: string): Promise<string | null> {
    // Here, you need to query the database based on the complete short URL
    const urlMapping = await this.urlModel.findOne({ shortId: `http://localhost:3000/urls/${shortUrl}` }).exec();
    return urlMapping ? urlMapping.longUrl : null;
  }
}


@Injectable()
export class UrlProfileService {
  constructor(@InjectModel(UrlMapping.name) private readonly urlModel: Model<UrlMapping>) {}

  async create(createUrlDto: CreateUrlDto,userId:string): Promise<UrlMapping> {
    const shortId = shortid.generate(); // Generate short ID
    const completeShortUrl = `http://localhost:3000/url/${shortId}`; // Complete short URL
    const createdUrl = new this.urlModel({ ...createUrlDto, shortId: completeShortUrl, userId });
    await createdUrl.save();
    return createdUrl;
  }

  async findByShortUrl(shortUrl: string): Promise<string | null> {
    // Here, you need to query the database based on the complete short URL
    const urlMapping = await this.urlModel.findOne({ shortId: `http://localhost:3000/url/${shortUrl}` }).exec();
    return urlMapping ? urlMapping.longUrl : null;
  }
}

// @Injectable()
// export class UrlProfileService {
//   constructor(@InjectModel(UrlMapping.name) private readonly urlModel: Model<UrlMapping>) {}

//   async create(createUrlDto: CreateUrlDto, userId: string): Promise<UrlMapping> {
//     let shortId = shortid.generate(); // Generate short ID
//     if (createUrlDto.customShortId) {
//       // Check if custom short URL is provided
//       const existingUrl = await this.urlModel.findOne({ shortId: createUrlDto.customShortId }).exec();
//       if (existingUrl) {
//         throw new Error('Custom short URL already exists'); // Handle the case where the custom short URL already exists
//       }
//       shortId = createUrlDto.customShortId;
//     }
//     const completeShortUrl = `http://localhost:3000/url/${shortId}`; // Complete short URL
//     const createdUrl = new this.urlModel({ ...createUrlDto, shortId: completeShortUrl, userId });
//     await createdUrl.save();
//     return createdUrl;
//   }

//   async findByShortUrl(shortUrl: string): Promise<string | null> {
//     const urlMapping = await this.urlModel.findOne({ shortId: `http://localhost:3000/url/${shortUrl}` }).exec();
//     return urlMapping ? urlMapping.longUrl : null;
//   }

//   async updateShortId(urlId: string, newShortId: string): Promise<UrlMapping | null> {
//     const urlMapping = await this.urlModel.findById(urlId).exec();
//     if (!urlMapping) {
//       return null; // URL not found
//     }
//     urlMapping.shortId = `http://localhost:3000/url/${newShortId}`;
//     await urlMapping.save();
//     return urlMapping;
//   }
// }




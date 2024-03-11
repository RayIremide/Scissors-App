import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UrlMapping, UrlMappingSchema } from './url-mapping.schema';

@Injectable()
export class UrlMappingModel {
  constructor(
    @InjectModel(UrlMapping.name)
    private urlMappingModel: Model<UrlMapping>,
  ) {}

  async createUrlMapping(shortId: string, longUrl: string, userId: string): Promise<UrlMapping> {
    const createdUrlMapping = new this.urlMappingModel({ shortId, longUrl, userId });
    return createdUrlMapping.save();
  }

  async findUrlMapping(shortId: string): Promise<UrlMapping | null> {
    return this.urlMappingModel.findOne({ shortId }).exec();
  }
}

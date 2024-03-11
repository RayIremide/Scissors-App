import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UrlMapping extends Document {
  
  @Prop({ required: true , unique: true})
  longUrl: string;

  @Prop()
  shortId: string;

  @Prop()
  qrCode: string; 

  @Prop({ default: 0 }) 
  visitCount: number;

  @Prop() 
  userId: string;

  @Prop({ default: Date.now }) 
  createdAt: Date; 
}



export const UrlMappingSchema = SchemaFactory.createForClass(UrlMapping);

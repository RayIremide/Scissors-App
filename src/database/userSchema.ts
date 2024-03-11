import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  googleId: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

}

export const UserSchema = SchemaFactory.createForClass(User);


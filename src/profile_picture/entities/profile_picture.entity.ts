import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type ProfilePictureDocument = HydratedDocument<ProfilePicture>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class ProfilePicture {
  @Prop({
    index: true,
    required: true,
  })
  public url: string;
}

export const ProfilePictureSchema =
  SchemaFactory.createForClass(ProfilePicture);

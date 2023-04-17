import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type AuthenticationMethodDocument =
  HydratedDocument<AuthenticationMethod>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class AuthenticationMethod {
  public _id: string;

  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  public key: string;

  @Prop({
    unique: true,
    required: true,
  })
  public name: string;
}

export const AuthenticationMethodSchema =
  SchemaFactory.createForClass(AuthenticationMethod);

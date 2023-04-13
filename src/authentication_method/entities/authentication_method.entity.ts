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
    required: true,
  })
  public name: string;
}

export const AuthenticationMethodSchema =
  SchemaFactory.createForClass(AuthenticationMethod);

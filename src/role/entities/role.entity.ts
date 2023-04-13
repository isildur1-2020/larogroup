import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true, versionKey: false })
export class Role {
  public _id: string;

  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type AccessGroupDocument = HydratedDocument<AccessGroup>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class AccessGroup {
  @Prop({
    required: true,
  })
  public name: string;
}

export const AccessGroupSchema = SchemaFactory.createForClass(AccessGroup);

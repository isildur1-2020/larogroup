import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;
const roleTypes = ['superadmin', 'administrator', 'coordinator', 'employee'];

@Schema({ timestamps: true, versionKey: false })
export class Role {
  @Prop({
    unique: true,
    required: true,
    enum: roleTypes,
  })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

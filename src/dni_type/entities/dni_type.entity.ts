import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DniTypeDocument = HydratedDocument<DniType>;

@Schema({ timestamps: true, versionKey: false })
export class DniType {
  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  name: string;
}

export const DniTypeSchema = SchemaFactory.createForClass(DniType);

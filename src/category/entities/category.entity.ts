import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, versionKey: false })
export class Category {
  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

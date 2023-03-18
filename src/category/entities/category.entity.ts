import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SubCompany } from 'src/sub_company/entities/sub_company.entity';

export type CategoryDocument = mongoose.HydratedDocument<Category>;

@Schema({ timestamps: true, versionKey: false })
export class Category {
  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCompany',
  })
  public sub_company: SubCompany;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

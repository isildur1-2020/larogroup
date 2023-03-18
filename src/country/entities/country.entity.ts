import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CountryDocument = HydratedDocument<Country>;

@Schema({ timestamps: true, versionKey: false })
export class Country {
  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  name: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);

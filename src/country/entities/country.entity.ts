import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CountryDocument = HydratedDocument<Country>;

@Schema({ timestamps: true })
export class Country {
  @Prop()
  id: number;

  @Prop()
  name: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);

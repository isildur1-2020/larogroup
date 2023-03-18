import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Country } from '../../country/entities/country.entity';

export type CityDocument = mongoose.HydratedDocument<City>;

@Schema({ timestamps: true })
export class City {
  @Prop()
  id: number;
  @Prop()
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country' })
  country: Country;
}

export const CitySchema = SchemaFactory.createForClass(City);

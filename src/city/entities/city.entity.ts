import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Country } from '../../country/entities/country.entity';

export type CityDocument = mongoose.HydratedDocument<City>;

@Schema({ timestamps: true, versionKey: false })
export class City {
  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    ref: 'Country',
    type: mongoose.Schema.Types.ObjectId,
  })
  country: Country;
}

export const CitySchema = SchemaFactory.createForClass(City);

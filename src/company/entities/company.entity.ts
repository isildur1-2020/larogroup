import * as mongoose from 'mongoose';
import { City } from 'src//city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CompanyDocument = mongoose.HydratedDocument<Company>;

@Schema({ timestamps: true, versionKey: false })
export class Company {
  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  public name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  public city: City;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  })
  public country: Country;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

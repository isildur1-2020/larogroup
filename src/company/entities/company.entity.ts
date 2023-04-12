import * as mongoose from 'mongoose';
import { City } from 'src//city/entities/city.entity';
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
}

export const CompanySchema = SchemaFactory.createForClass(Company);

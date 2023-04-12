import * as mongoose from 'mongoose';
import { City } from 'src/city/entities/city.entity';
import { Company } from 'src/company/entities/company.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SubCompanyDocument = mongoose.HydratedDocument<SubCompany>;

@Schema({ timestamps: true, versionKey: false })
export class SubCompany {
  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  public name: string;

  @Prop({
    ref: 'City',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public city: City;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  })
  public company: Company;
}

export const SubCompanySchema = SchemaFactory.createForClass(SubCompany);

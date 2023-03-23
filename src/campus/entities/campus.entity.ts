import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CampusDocument = mongoose.HydratedDocument<Campus>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Campus {
  @Prop({
    required: true,
  })
  public name: string;

  @Prop({
    required: true,
    ref: 'SubCompany',
    type: mongoose.Schema.Types.ObjectId,
  })
  public sub_company: string;
}

export const CampusSchema = SchemaFactory.createForClass(Campus);

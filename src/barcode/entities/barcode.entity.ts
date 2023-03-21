import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BarcodeDocument = mongoose.HydratedDocument<Barcode>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Barcode {
  @Prop({
    ref: 'Employee',
    required: true,
    immutable: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: string;

  @Prop({
    required: true,
  })
  public data: string;
}

export const BarcodeSchema = SchemaFactory.createForClass(Barcode);

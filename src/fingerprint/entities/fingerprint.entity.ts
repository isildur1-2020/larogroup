import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FingerprintDocument = mongoose.HydratedDocument<Fingerprint>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Fingerprint {
  @Prop({
    required: true,
    immutable: true,
    ref: 'Employee',
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: string;

  @Prop({
    required: true,
    immutable: true,
  })
  public fingerprint: string;
}

export const FingerprintSchema = SchemaFactory.createForClass(Fingerprint);

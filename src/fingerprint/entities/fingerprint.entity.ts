import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type FingerprintDocument = mongoose.HydratedDocument<Fingerprint>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Fingerprint {
  public _id: string;

  @Prop({
    required: true,
    immutable: true,
    ref: 'Employee',
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: Employee;

  @Prop({
    required: true,
    immutable: true,
  })
  public fingerprint: string;
}

export const FingerprintSchema = SchemaFactory.createForClass(Fingerprint);

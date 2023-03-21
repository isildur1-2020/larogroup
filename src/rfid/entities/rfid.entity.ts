import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type RfidDocument = mongoose.HydratedDocument<Rfid>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Rfid {
  @Prop({
    required: true,
    ref: 'Employee',
    immutable: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: Employee;

  @Prop({
    required: true,
  })
  public data: string;
}

export const RfidSchema = SchemaFactory.createForClass(Rfid);

import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type FacialDocument = mongoose.HydratedDocument<Facial>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Facial {
  @Prop({
    require: true,
    ref: 'Employee',
    immutable: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: Employee;

  @Prop({
    required: true,
    immutable: true,
    type: mongoose.Schema.Types.Buffer,
  })
  public data: Buffer;
}

export const FacialSchema = SchemaFactory.createForClass(Facial);

import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from '../../employee/entities/employee.entity';
import { AccessGroup } from '../../access_group/entities/access_group.entity';

export type AccessEmployeeDocument = mongoose.HydratedDocument<AccessEmployee>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class AccessEmployee {
  @Prop({
    required: true,
    ref: 'AccessGroup',
    type: mongoose.Schema.Types.ObjectId,
  })
  public access_group: AccessGroup;

  @Prop({
    required: true,
    ref: 'Employee',
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: Employee;
}

export const AccessEmployeeSchema =
  SchemaFactory.createForClass(AccessEmployee);

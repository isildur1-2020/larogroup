import * as mongoose from 'mongoose';
import { Device } from 'src/device/entities/device.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type AttendanceDocument = mongoose.HydratedDocument<Attendance>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Attendance {
  public _id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public device: Device;

  @Prop({
    ref: 'Vehicle',
    type: mongoose.Schema.Types.ObjectId,
  })
  public vehicle: Vehicle;

  @Prop({
    ref: 'Employee',
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: Employee;

  @Prop({
    required: true,
  })
  public entity: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

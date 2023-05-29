import mongoose from 'mongoose';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type ExplusionDocument = mongoose.HydratedDocument<Expulsion>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Expulsion {
  @Prop({
    default: 'manual',
  })
  public type: string;

  @Prop({
    required: true,
  })
  public username: string;

  @Prop({
    index: true,
    required: true,
  })
  public entity: string;

  @Prop({
    ref: 'Employee',
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: Employee;

  @Prop({
    ref: 'Vehicle',
    type: mongoose.Schema.Types.ObjectId,
  })
  public vehicle: Vehicle;
}

export const ExpulsionSchema = SchemaFactory.createForClass(Expulsion);

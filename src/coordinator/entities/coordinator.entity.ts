import * as mongoose from 'mongoose';
import { Role } from 'src/role/entities/role.entity';
import { Campus } from 'src/campus/entities/campus.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type CoordinatorDocument = mongoose.HydratedDocument<Coordinator>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Coordinator {
  public _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    default: true,
  })
  public is_active: boolean;

  @Prop({
    ref: 'Role',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public role: Role;

  @Prop({
    ref: 'Employee',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: Employee;

  @Prop({
    index: true,
    unique: true,
    required: true,
    inmutable: true,
  })
  public username: string;

  @Prop({
    required: true,
  })
  public password: string;

  @Prop({
    required: true,
    ref: 'Campus',
    type: mongoose.Schema.Types.ObjectId,
  })
  public campus: Campus;
}

export const CoordinatorSchema = SchemaFactory.createForClass(Coordinator);

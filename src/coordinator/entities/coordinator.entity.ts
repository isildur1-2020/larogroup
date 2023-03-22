import * as mongoose from 'mongoose';
import { roles_ids } from '../../utils/role_ids';
import { Role } from 'src/role/entities/role.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type CoordinatorDocument = mongoose.HydratedDocument<Coordinator>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Coordinator {
  @Prop({
    default: true,
  })
  public is_active: boolean;

  @Prop({
    ref: 'Role',
    default: roles_ids.coordinator,
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
    unique: true,
    required: true,
  })
  public username: string;

  @Prop({
    required: true,
  })
  public password: string;
}

export const CoordinatorSchema = SchemaFactory.createForClass(Coordinator);

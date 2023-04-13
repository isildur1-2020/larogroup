import * as mongoose from 'mongoose';
import { roles_ids } from '../../utils/role_ids';
import { Role } from 'src/role/entities/role.entity';
import { Campus } from 'src/campus/entities/campus.entity';
import { Company } from 'src/company/entities/company.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';
import { SubCompany } from 'src/sub_company/entities/sub_company.entity';

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
    index: true,
  })
  public username: string;

  @Prop({
    required: true,
  })
  public password: string;

  @Prop({
    required: true,
    ref: 'SubCompany',
    type: mongoose.Schema.Types.ObjectId,
  })
  public sub_company: SubCompany;

  @Prop({
    required: true,
    ref: 'Company',
    type: mongoose.Schema.Types.ObjectId,
  })
  public company: Company;

  @Prop({
    required: true,
    ref: 'Campus',
    type: mongoose.Schema.Types.ObjectId,
  })
  public campus: Campus;
}

export const CoordinatorSchema = SchemaFactory.createForClass(Coordinator);

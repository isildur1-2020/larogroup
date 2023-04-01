import * as mongoose from 'mongoose';
import { roles_ids } from '../../utils/role_ids';
import { Role } from 'src/role/entities/role.entity';
import { City } from 'src/city/entities/city.entity';
import { Campus } from 'src/campus/entities/campus.entity';
import { Country } from 'src/country/entities/country.entity';
import { Company } from 'src/company/entities/company.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DniType } from 'src/dni_type/entities/dni_type.entity';
import { Category } from 'src/category/entities/category.entity';
import { SubCompany } from 'src/sub_company/entities/sub_company.entity';

export type EmployeeDocument = mongoose.HydratedDocument<Employee>;

@Schema({
  timestamps: false,
  versionKey: false,
})
export class Employee {
  public _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    unique: true,
    default: null,
  })
  public employee_id: string;

  @Prop({
    default: true,
  })
  public is_active: boolean;

  @Prop({
    ref: 'Role',
    immutable: true,
    default: roles_ids.employee,
    type: mongoose.Schema.Types.ObjectId,
  })
  public role: Role;

  @Prop({
    ref: 'DniType',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public dni_type: DniType;

  @Prop({
    required: true,
  })
  public dni: string;

  @Prop({
    required: true,
  })
  public first_name: string;

  @Prop()
  public second_name: string;

  @Prop({
    required: true,
  })
  public first_lastname: string;

  @Prop()
  public second_lastname: string;

  @Prop({
    unique: true,
  })
  public email: string;

  @Prop()
  public phone: string;

  @Prop({
    required: true,
    ref: 'Category',
    type: mongoose.Schema.Types.ObjectId,
  })
  public first_category: Category;

  @Prop({
    ref: 'Category',
    type: mongoose.Schema.Types.ObjectId,
  })
  public second_category: Category;

  @Prop({
    required: true,
    ref: 'SubCompany',
    type: mongoose.Schema.Types.ObjectId,
  })
  public sub_company: SubCompany;

  @Prop({
    required: true,
    ref: 'Campus',
    type: mongoose.Schema.Types.ObjectId,
  })
  public campus: Campus;

  @Prop({
    required: true,
    ref: 'Company',
    type: mongoose.Schema.Types.ObjectId,
  })
  public company: Company;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  public contract_start_date: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  public contract_end_date: string;

  @Prop({
    ref: 'Country',
    type: mongoose.Schema.Types.ObjectId,
  })
  public country: Country;

  @Prop({
    ref: 'City',
    type: mongoose.Schema.Types.ObjectId,
  })
  public city: City;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

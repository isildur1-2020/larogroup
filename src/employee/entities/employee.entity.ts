import * as mongoose from 'mongoose';
import { City } from 'src/city/entities/city.entity';
import { Role } from 'src/role/entities/role.entity';
import { Campus } from 'src/campus/entities/campus.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DniType } from 'src/dni_type/entities/dni_type.entity';
import { Category } from 'src/category/entities/category.entity';
import { AccessGroup } from 'src/access_group/entities/access_group.entity';
import { ProfilePicture } from 'src/profile_picture/entities/profile_picture.entity';

export type EmployeeDocument = mongoose.HydratedDocument<Employee>;

@Schema({
  timestamps: false,
  versionKey: false,
})
export class Employee {
  public _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public role: Role;

  @Prop({
    unique: true,
    required: true,
  })
  public employee_id: string;

  @Prop({
    default: true,
  })
  public is_active: boolean;

  @Prop({
    ref: 'DniType',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public dni_type: DniType;

  @Prop({
    required: true,
    unique: true,
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
    required: true,
    unique: true,
  })
  public email: string;

  @Prop()
  public phone: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  })
  public categories: Category[];

  @Prop({
    required: true,
    ref: 'Campus',
    type: mongoose.Schema.Types.ObjectId,
  })
  public campus: Campus;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  public contract_start_date: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
  })
  public contract_end_date: string;

  @Prop({
    ref: 'City',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public city: City;

  @Prop({
    index: true,
    unique: true,
  })
  public barcode: string;

  @Prop({
    index: true,
    unique: true,
  })
  public rfid: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProfilePicture',
      },
    ],
  })
  public profile_picture: ProfilePicture[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccessGroup',
      },
    ],
  })
  public access_group: AccessGroup[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

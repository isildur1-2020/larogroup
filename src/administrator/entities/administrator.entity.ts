import * as mongoose from 'mongoose';
import { roles_ids } from '../../utils/role_ids';
import { Role } from 'src/role/entities/role.entity';
import { Company } from 'src/company/entities/company.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AdministratorDocument = mongoose.HydratedDocument<Administrator>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Administrator {
  public _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    default: true,
  })
  public is_active: boolean;

  @Prop({
    ref: 'Role',
    immutable: true,
    default: roles_ids.administrator,
    type: mongoose.Schema.Types.ObjectId,
  })
  public role: Role;

  @Prop({
    unique: true,
    required: true,
  })
  public email: string;

  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  public username: string;

  @Prop({
    required: true,
  })
  public password: string;

  @Prop({
    required: true,
    ref: 'Company',
    type: mongoose.Schema.Types.ObjectId,
  })
  public company: Company;
}

export const AdministratorSchema = SchemaFactory.createForClass(Administrator);

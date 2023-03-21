import * as mongoose from 'mongoose';
import { roles_ids } from '../../utils/role_ids';
import { Role } from 'src/role/entities/role.entity';
import { Company } from 'src/company/entities/company.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type SuperadminDocument = mongoose.HydratedDocument<Superadmin>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Superadmin {
  @Prop({
    ref: 'Role',
    immutable: true,
    default: roles_ids.superadmin,
    type: mongoose.Schema.Types.ObjectId,
  })
  public role: Role;

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

export const SuperadminSchema = SchemaFactory.createForClass(Superadmin);

import * as mongoose from 'mongoose';
import { Device } from 'src/device/entities/device.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SubCompany } from 'src/sub_company/entities/sub_company.entity';

export type AccessGroupDocument = mongoose.HydratedDocument<AccessGroup>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class AccessGroup {
  @Prop({
    required: true,
    unique: true,
  })
  public name: string;

  @Prop({
    required: true,
    ref: 'SubCompany',
    type: mongoose.Schema.Types.ObjectId,
  })
  public sub_company: SubCompany;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
      },
    ],
  })
  public device: Device[];
}

export const AccessGroupSchema = SchemaFactory.createForClass(AccessGroup);

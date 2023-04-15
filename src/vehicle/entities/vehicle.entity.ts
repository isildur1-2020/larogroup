import * as mongoose from 'mongoose';
import { Role } from 'src/role/entities/role.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ProfilePicture } from 'src/profile_picture/entities/profile_picture.entity';

export type VehicleDocument = mongoose.HydratedDocument<Vehicle>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Vehicle {
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
    required: true,
  })
  public type: string;

  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  public plate: string;

  @Prop({
    required: true,
  })
  public model: string;

  @Prop({
    required: true,
  })
  public color: string;

  @Prop()
  public description: string;

  @Prop({
    required: true,
  })
  public fabricator: string;

  @Prop()
  barcode: string;

  @Prop({
    default: null,
    ref: 'ProfilePicture',
    type: mongoose.Schema.Types.ObjectId,
  })
  profile_picture: ProfilePicture;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
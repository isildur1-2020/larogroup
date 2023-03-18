import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DniTypeDocument = HydratedDocument<DniType>;

const dniTypes = [
  'Pasaporte',
  'Tarjeta de identidad',
  'Cédula de ciudadanía',
  'Cédula de extranjería',
];

@Schema({ timestamps: true, versionKey: false })
export class DniType {
  @Prop({
    index: true,
    unique: true,
    required: true,
    enum: dniTypes,
  })
  name: string;
}

export const DniTypeSchema = SchemaFactory.createForClass(DniType);

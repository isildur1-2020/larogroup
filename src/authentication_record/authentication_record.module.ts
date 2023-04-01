import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RfidModule } from 'src/rfid/rfid.module';
import { DeviceModule } from 'src/device/device.module';
import { ReasonModule } from 'src/reason/reason.module';
import { BarcodeModule } from 'src/barcode/barcode.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { AuthenticationRecordService } from './authentication_record.service';
import { AuthenticationRecordController } from './authentication_record.controller';
import { AuthenticationMethodModule } from '../authentication_method/authentication_method.module';
import {
  AuthenticationRecord,
  AuthenticationRecordSchema,
} from './entities/authentication_record.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthenticationRecord.name,
        schema: AuthenticationRecordSchema,
      },
    ]),
    RfidModule,
    DeviceModule,
    ReasonModule,
    BarcodeModule,
    EmployeeModule,
    AuthenticationMethodModule,
  ],
  controllers: [AuthenticationRecordController],
  providers: [AuthenticationRecordService],
  exports: [AuthenticationRecordService],
})
export class AuthenticationRecordModule {}

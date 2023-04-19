import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceModule } from 'src/device/device.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { AccessGroupModule } from 'src/access_group/access_group.module';
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
    DeviceModule,
    VehicleModule,
    EmployeeModule,
    AccessGroupModule,
    AuthenticationMethodModule,
  ],
  controllers: [AuthenticationRecordController],
  providers: [AuthenticationRecordService],
  exports: [AuthenticationRecordService],
})
export class AuthenticationRecordModule {}

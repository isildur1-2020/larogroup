import { MongooseModule } from '@nestjs/mongoose';
import { ZoneModule } from 'src/zone/zone.module';
import { Module, forwardRef } from '@nestjs/common';
import { DeviceModule } from 'src/device/device.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { AttendanceModule } from 'src/attendance/attendance.module';
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
    ZoneModule,
    AttendanceModule,
    forwardRef(() => DeviceModule),
    forwardRef(() => VehicleModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => AccessGroupModule),
    forwardRef(() => AuthenticationMethodModule),
  ],
  controllers: [AuthenticationRecordController],
  providers: [AuthenticationRecordService],
  exports: [AuthenticationRecordService],
})
export class AuthenticationRecordModule {}

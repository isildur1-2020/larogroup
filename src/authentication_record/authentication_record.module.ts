import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceModule } from 'src/device/device.module';
import { ReasonModule } from 'src/reason/reason.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
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
    ReasonModule,
    EmployeeModule,
    CoordinatorModule,
    AuthenticationMethodModule,
  ],
  controllers: [AuthenticationRecordController],
  providers: [AuthenticationRecordService],
  exports: [AuthenticationRecordService],
})
export class AuthenticationRecordModule {}

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceService } from './attendance.service';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { AttendanceController } from './attendance.controller';
import { ExpulsionModule } from 'src/expulsion/expulsion.module';
import { Attendance, AttendanceSchema } from './entities/attendance.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Attendance.name,
        schema: AttendanceSchema,
      },
    ]),
    ExpulsionModule,
    forwardRef(() => VehicleModule),
    forwardRef(() => EmployeeModule),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}

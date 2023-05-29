import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceService } from './attendance.service';
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
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}

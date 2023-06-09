import { Observable } from 'rxjs';
import { CustomRequest } from '../interfaces/authRecord.interface';
import { AttendanceService } from 'src/attendance/attendance.service';
import {
  Inject,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

export class AttendanceInterceptor implements NestInterceptor {
  constructor(
    @Inject(AttendanceService)
    private attendanceService: AttendanceService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const { vehicleFound, employeeFound, deviceFound } = req;
    const { check_attendance, uncheck_attendance } = deviceFound;
    const attendanceData = {
      device: deviceFound,
      vehicle: vehicleFound,
      employee: employeeFound,
      entity: req.entityName,
    };
    if (check_attendance) {
      const attendanceFound = await this.attendanceService.findOne(
        attendanceData,
      );
      if (attendanceFound === null) {
        await this.attendanceService.create(attendanceData);
      }
    } else if (uncheck_attendance) {
      await this.attendanceService.remove(attendanceData);
    }
    return next.handle();
  }
}

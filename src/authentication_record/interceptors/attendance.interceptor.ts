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
    const body = {
      device: deviceFound,
      vehicle: vehicleFound,
      employee: employeeFound,
      entity: req.entityName,
    };
    if (!check_attendance && !uncheck_attendance) return next.handle();
    const attendanceFound = await this.attendanceService.findOne(body);
    if (check_attendance) {
      if (attendanceFound !== null) await this.attendanceService.remove(body);
      await this.attendanceService.create(body);
    } else if (uncheck_attendance && attendanceFound !== null) {
      await this.attendanceService.remove(body);
    }
    return next.handle();
  }
}

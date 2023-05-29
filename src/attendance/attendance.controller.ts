import { AttendanceService } from './attendance.service';
import { Get, Controller, Delete, Param } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { CurrentUser } from 'src/auth/interfaces/jwt-payload.interface';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator, ValidRoles.coordinator)
  findAll() {
    return this.attendanceService.findAll();
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  deleteOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() currentUser: CurrentUser,
  ) {
    return this.attendanceService.deleteOne(id, currentUser);
  }
}

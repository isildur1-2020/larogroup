import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator, ValidRoles.coordinator)
  findAll(@GetUser() payload: JwtPayload) {
    return this.employeeService.findAll(payload);
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.employeeService.remove(id);
  }
}

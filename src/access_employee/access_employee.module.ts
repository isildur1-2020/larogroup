import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeModule } from 'src/employee/employee.module';
import { AccessEmployeeService } from './access_employee.service';
import { AccessEmployeeController } from './access_employee.controller';
import { AccessGroupModule } from 'src/access_group/access_group.module';
import {
  AccessEmployee,
  AccessEmployeeSchema,
} from './entities/access_employee.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AccessEmployee.name,
        schema: AccessEmployeeSchema,
      },
    ]),
    EmployeeModule,
    AccessGroupModule,
  ],
  controllers: [AccessEmployeeController],
  providers: [AccessEmployeeService],
})
export class AccessEmployeeModule {}

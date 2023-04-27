import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { DeviceModule } from 'src/device/device.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { AccessGroupService } from './access_group.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { AccessGroupController } from './access_group.controller';
import { SubCompanyModule } from 'src/sub_company/sub_company.module';
import { AccessGroup, AccessGroupSchema } from './entities/access_group.entity';
import { AuthenticationRecordModule } from 'src/authentication_record/authentication_record.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AccessGroup.name,
        schema: AccessGroupSchema,
      },
    ]),
    forwardRef(() => DeviceModule),
    forwardRef(() => VehicleModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => SubCompanyModule),
    forwardRef(() => AuthenticationRecordModule),
  ],
  controllers: [AccessGroupController],
  providers: [AccessGroupService],
  exports: [AccessGroupService],
})
export class AccessGroupModule {}

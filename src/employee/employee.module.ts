import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/city/city.module';
import { RoleModule } from 'src/role/role.module';
import { Module, forwardRef } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CampusModule } from 'src/campus/campus.module';
import { EmployeeController } from './employee.controller';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { DniTypeModule } from 'src/dni_type/dni_type.module';
import { CategoryModule } from 'src/category/category.module';
import { Employee, EmployeeSchema } from './entities/employee.entity';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
import { FingerprintModule } from 'src/fingerprint/fingerprint.module';
import { AccessGroupModule } from 'src/access_group/access_group.module';
import { ProfilePictureModule } from 'src/profile_picture/profile_picture.module';
import { AuthenticationRecordModule } from 'src/authentication_record/authentication_record.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Employee.name,
        schema: EmployeeSchema,
      },
    ]),
    CategoryModule,
    ProfilePictureModule,
    forwardRef(() => CityModule),
    forwardRef(() => RoleModule),
    forwardRef(() => CampusModule),
    forwardRef(() => DniTypeModule),
    forwardRef(() => VehicleModule),
    forwardRef(() => AccessGroupModule),
    forwardRef(() => FingerprintModule),
    forwardRef(() => CoordinatorModule),
    forwardRef(() => AuthenticationRecordModule),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}

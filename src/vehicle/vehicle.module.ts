import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { VehicleService } from './vehicle.service';
import { Module, forwardRef } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { EmployeeModule } from 'src/employee/employee.module';
import { Vehicle, VehicleSchema } from './entities/vehicle.entity';
import { AccessGroupModule } from 'src/access_group/access_group.module';
import { ProfilePictureModule } from 'src/profile_picture/profile_picture.module';
import { AuthenticationRecordModule } from 'src/authentication_record/authentication_record.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vehicle.name,
        schema: VehicleSchema,
      },
    ]),
    ProfilePictureModule,
    forwardRef(() => RoleModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => AccessGroupModule),
    forwardRef(() => AuthenticationRecordModule),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}

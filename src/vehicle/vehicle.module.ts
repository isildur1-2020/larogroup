import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { VehicleService } from './vehicle.service';
import { Module, forwardRef } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { EmployeeModule } from 'src/employee/employee.module';
import { Vehicle, VehicleSchema } from './entities/vehicle.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vehicle.name,
        schema: VehicleSchema,
      },
    ]),
    RoleModule,
    forwardRef(() => EmployeeModule),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}

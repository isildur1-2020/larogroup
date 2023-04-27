import { RoleService } from './role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleController } from './role.controller';
import { Module, forwardRef } from '@nestjs/common';
import { Role, RoleSchema } from './entities/role.entity';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { SuperadminModule } from 'src/superadmin/superadmin.module';
import { CoordinatorModule } from '../coordinator/coordinator.module';
import { AdministratorModule } from 'src/administrator/administrator.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
    forwardRef(() => VehicleModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => SuperadminModule),
    forwardRef(() => CoordinatorModule),
    forwardRef(() => AdministratorModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { Module, forwardRef } from '@nestjs/common';
import { CampusModule } from 'src/campus/campus.module';
import { CoordinatorService } from './coordinator.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { CoordinatorController } from './coordinator.controller';
import { SuperadminModule } from 'src/superadmin/superadmin.module';
import { SubCompanyModule } from 'src/sub_company/sub_company.module';
import { AdministratorModule } from 'src/administrator/administrator.module';
import { Coordinator, CoordinatorSchema } from './entities/coordinator.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coordinator.name,
        schema: CoordinatorSchema,
      },
    ]),
    RoleModule,
    CampusModule,
    EmployeeModule,
    SubCompanyModule,
    forwardRef(() => SuperadminModule),
    forwardRef(() => AdministratorModule),
  ],
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
  exports: [CoordinatorService],
})
export class CoordinatorModule {}

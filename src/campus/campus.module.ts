import { CampusService } from './campus.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { CampusController } from './campus.controller';
import { DeviceModule } from 'src/device/device.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { Campus, CampusSchema } from './entities/campus.entity';
import { SubCompanyModule } from 'src/sub_company/sub_company.module';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Campus.name,
        schema: CampusSchema,
      },
    ]),
    forwardRef(() => DeviceModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => SubCompanyModule),
    forwardRef(() => CoordinatorModule),
  ],
  controllers: [CampusController],
  providers: [CampusService],
  exports: [CampusService],
})
export class CampusModule {}

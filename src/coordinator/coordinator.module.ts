import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CampusModule } from 'src/campus/campus.module';
import { CoordinatorService } from './coordinator.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { CoordinatorController } from './coordinator.controller';
import { SubCompanyModule } from 'src/sub_company/sub_company.module';
import { Coordinator, CoordinatorSchema } from './entities/coordinator.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coordinator.name,
        schema: CoordinatorSchema,
      },
    ]),
    CampusModule,
    EmployeeModule,
    SubCompanyModule,
  ],
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
  exports: [CoordinatorService],
})
export class CoordinatorModule {}

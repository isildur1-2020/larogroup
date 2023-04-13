import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/city/city.module';
import { RfidModule } from 'src/rfid/rfid.module';
import { EmployeeService } from './employee.service';
import { CampusModule } from 'src/campus/campus.module';
import { EmployeeController } from './employee.controller';
import { CompanyModule } from 'src/company/company.module';
import { BarcodeModule } from 'src/barcode/barcode.module';
import { DniTypeModule } from 'src/dni_type/dni_type.module';
import { CategoryModule } from 'src/category/category.module';
import { Employee, EmployeeSchema } from './entities/employee.entity';
import { SubCompanyModule } from 'src/sub_company/sub_company.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Employee.name,
        schema: EmployeeSchema,
      },
    ]),
    CityModule,
    CampusModule,
    DniTypeModule,
    CompanyModule,
    CategoryModule,
    SubCompanyModule,
    forwardRef(() => RfidModule),
    forwardRef(() => BarcodeModule),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}

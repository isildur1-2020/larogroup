import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/city/city.module';
import { EmployeeService } from './employee.service';
import { CampusModule } from 'src/campus/campus.module';
import { EmployeeController } from './employee.controller';
import { CountryModule } from 'src/country/country.module';
import { CompanyModule } from 'src/company/company.module';
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
    CountryModule,
    DniTypeModule,
    CompanyModule,
    CategoryModule,
    SubCompanyModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}

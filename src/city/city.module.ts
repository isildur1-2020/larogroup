import { CityService } from './city.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CityController } from './city.controller';
import { Module, forwardRef } from '@nestjs/common';
import { City, CitySchema } from './entities/city.entity';
import { CountryModule } from 'src/country/country.module';
import { CompanyModule } from 'src/company/company.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { SubCompanyModule } from 'src/sub_company/sub_company.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: City.name,
        schema: CitySchema,
      },
    ]),
    forwardRef(() => CompanyModule),
    forwardRef(() => CountryModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => SubCompanyModule),
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}

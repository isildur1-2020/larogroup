import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/city/city.module';
import { SubCompanyService } from './sub_company.service';
import { CountryModule } from 'src/country/country.module';
import { CompanyModule } from 'src/company/company.module';
import { SubCompanyController } from './sub_company.controller';
import { SubCompany, SubCompanySchema } from './entities/sub_company.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SubCompany.name,
        schema: SubCompanySchema,
      },
    ]),
    CityModule,
    CountryModule,
    CompanyModule,
  ],
  controllers: [SubCompanyController],
  providers: [SubCompanyService],
  exports: [SubCompanyService],
})
export class SubCompanyModule {}

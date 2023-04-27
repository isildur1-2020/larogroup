import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/city/city.module';
import { CompanyService } from './company.service';
import { Module, forwardRef } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { Company, CompanySchema } from './entities/company.entity';
import { SubCompanyModule } from 'src/sub_company/sub_company.module';
import { AdministratorModule } from 'src/administrator/administrator.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
    forwardRef(() => CityModule),
    forwardRef(() => SubCompanyModule),
    forwardRef(() => AdministratorModule),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}

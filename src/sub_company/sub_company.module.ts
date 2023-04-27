import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from 'src/city/city.module';
import { Module, forwardRef } from '@nestjs/common';
import { CampusModule } from 'src/campus/campus.module';
import { SubCompanyService } from './sub_company.service';
import { CompanyModule } from 'src/company/company.module';
import { CategoryModule } from 'src/category/category.module';
import { SubCompanyController } from './sub_company.controller';
import { AccessGroupModule } from 'src/access_group/access_group.module';
import { SubCompany, SubCompanySchema } from './entities/sub_company.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SubCompany.name,
        schema: SubCompanySchema,
      },
    ]),
    forwardRef(() => CityModule),
    forwardRef(() => CampusModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => AccessGroupModule),
  ],
  controllers: [SubCompanyController],
  providers: [SubCompanyService],
  exports: [SubCompanyService],
})
export class SubCompanyModule {}

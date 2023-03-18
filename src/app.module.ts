import { Module } from '@nestjs/common';
import { CityModule } from './city/city.module';
import { RoleModule } from './role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryModule } from './country/country.module';
import { CompanyModule } from './company/company.module';
import { DniTypeModule } from './dni_type/dni_type.module';
import { CategoryModule } from './category/category.module';
import { EmployeeModule } from './employee/employee.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { SubCompanyModule } from './sub_company/sub_company.module';
import { AdministratorModule } from './administrator/administrator.module';

const MONGO_DB_URI = `mongodb+srv://larosoft:d2DTZoc5EhPH2pwF@larogroupcluster.zo0y98k.mongodb.net/larogroup?retryWrites=true&w=majority`;

@Module({
  imports: [
    CityModule,
    RoleModule,
    CountryModule,
    DniTypeModule,
    CompanyModule,
    CategoryModule,
    EmployeeModule,
    SuperadminModule,
    SubCompanyModule,
    AdministratorModule,
    MongooseModule.forRoot(MONGO_DB_URI),
  ],
})
export class AppModule {}

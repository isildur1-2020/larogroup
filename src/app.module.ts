import { Module } from '@nestjs/common';
import { CityModule } from './city/city.module';
import { RoleModule } from './role/role.module';
import { RfidModule } from './rfid/rfid.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FacialModule } from './facial/facial.module';
import { CountryModule } from './country/country.module';
import { CompanyModule } from './company/company.module';
import { BarcodeModule } from './barcode/barcode.module';
import { DniTypeModule } from './dni_type/dni_type.module';
import { CategoryModule } from './category/category.module';
import { EmployeeModule } from './employee/employee.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { SubCompanyModule } from './sub_company/sub_company.module';
import { FingerprintModule } from './fingerprint/fingerprint.module';
import { AdministratorModule } from './administrator/administrator.module';

const MONGO_DB_URI = `mongodb+srv://larosoft:d2DTZoc5EhPH2pwF@larogroupcluster.zo0y98k.mongodb.net/larogroup?retryWrites=true&w=majority`;

@Module({
  imports: [
    CityModule,
    RoleModule,
    RfidModule,
    FacialModule,
    CountryModule,
    DniTypeModule,
    CompanyModule,
    BarcodeModule,
    CategoryModule,
    EmployeeModule,
    SuperadminModule,
    SubCompanyModule,
    FingerprintModule,
    AdministratorModule,
    MongooseModule.forRoot(MONGO_DB_URI),
  ],
})
export class AppModule {}

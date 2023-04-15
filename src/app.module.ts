import { join } from 'path';
import { Module } from '@nestjs/common';
import { filePath } from './utils/filePath';
import { ConfigModule } from '@nestjs/config';
import { CityModule } from './city/city.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CampusModule } from './campus/campus.module';
import { DeviceModule } from './device/device.module';
import { ReasonModule } from './reason/reason.module';
import { EnvConfiguration } from './config/app.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CountryModule } from './country/country.module';
import { CompanyModule } from './company/company.module';
import { DniTypeModule } from './dni_type/dni_type.module';
import { CategoryModule } from './category/category.module';
import { EmployeeModule } from './employee/employee.module';
import { joiValidationSchema } from './config/joi.validation';
import { SuperadminModule } from './superadmin/superadmin.module';
import { SubCompanyModule } from './sub_company/sub_company.module';
import { FingerprintModule } from './fingerprint/fingerprint.module';
import { CoordinatorModule } from './coordinator/coordinator.module';
import { AccessGroupModule } from './access_group/access_group.module';
import { AccessDeviceModule } from './access_device/access_device.module';
import { AdministratorModule } from './administrator/administrator.module';
import { AccessEmployeeModule } from './access_employee/access_employee.module';
import { AuthenticationMethodModule } from './authentication_method/authentication_method.module';
import { AuthenticationRecordModule } from './authentication_record/authentication_record.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: joiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', filePath.profilePictures),
    }),
    CityModule,
    RoleModule,
    AuthModule,
    DeviceModule,
    CampusModule,
    ReasonModule,
    CountryModule,
    DniTypeModule,
    CompanyModule,
    CategoryModule,
    EmployeeModule,
    SuperadminModule,
    SubCompanyModule,
    AccessGroupModule,
    FingerprintModule,
    CoordinatorModule,
    AccessDeviceModule,
    AdministratorModule,
    AccessEmployeeModule,
    AuthenticationMethodModule,
    AuthenticationRecordModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
})
export class AppModule {}

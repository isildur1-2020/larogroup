import { join } from 'path';
import { Module } from '@nestjs/common';
import { filePath } from './utils/filePath';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';
import { CityModule } from './city/city.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CampusModule } from './campus/campus.module';
import { DeviceModule } from './device/device.module';
import { EnvConfiguration } from './config/app.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CountryModule } from './country/country.module';
import { CompanyModule } from './company/company.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { DniTypeModule } from './dni_type/dni_type.module';
import { CategoryModule } from './category/category.module';
import { EmployeeModule } from './employee/employee.module';
import { joiValidationSchema } from './config/joi.validation';
import { ExpulsionModule } from './expulsion/expulsion.module';
import { DirectionModule } from './direction/direction.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SubCompanyModule } from './sub_company/sub_company.module';
import { FingerprintModule } from './fingerprint/fingerprint.module';
import { CoordinatorModule } from './coordinator/coordinator.module';
import { AccessGroupModule } from './access_group/access_group.module';
import { AdministratorModule } from './administrator/administrator.module';
import { ProfilePictureModule } from './profile_picture/profile_picture.module';
import { AuthenticationMethodModule } from './authentication_method/authentication_method.module';
import { AuthenticationRecordModule } from './authentication_record/authentication_record.module';

const DB_HOST = process.env.MONGO_HOST;
const DB_PWD = process.env.ROOT_PASSWORD;
const DB_USER = process.env.ROOT_USERNAME;
const DB_NAME = process.env.MONGO_DATABASE;
const MONGODB_URI = `mongodb://${DB_USER}:${DB_PWD}@${DB_HOST}/${DB_NAME}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: joiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', filePath.root),
    }),
    CityModule,
    RoleModule,
    AuthModule,
    SeedModule,
    DeviceModule,
    CampusModule,
    CountryModule,
    DniTypeModule,
    VehicleModule,
    CompanyModule,
    CategoryModule,
    EmployeeModule,
    DirectionModule,
    ExpulsionModule,
    SuperadminModule,
    SubCompanyModule,
    AttendanceModule,
    AccessGroupModule,
    FingerprintModule,
    CoordinatorModule,
    AdministratorModule,
    ProfilePictureModule,
    AuthenticationMethodModule,
    AuthenticationRecordModule,
    MongooseModule.forRoot(MONGODB_URI),
  ],
})
export class AppModule {}

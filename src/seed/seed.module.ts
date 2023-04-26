import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ConfigModule } from '@nestjs/config';
import { CityModule } from 'src/city/city.module';
import { RoleModule } from 'src/role/role.module';
import { SeedController } from './seed.controller';
import { CampusModule } from 'src/campus/campus.module';
import { CountryModule } from 'src/country/country.module';
import { CompanyModule } from 'src/company/company.module';
import { DniTypeModule } from 'src/dni_type/dni_type.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { DirectionModule } from 'src/direction/direction.module';
import { SuperadminModule } from 'src/superadmin/superadmin.module';
import { SubCompanyModule } from 'src/sub_company/sub_company.module';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
import { AdministratorModule } from 'src/administrator/administrator.module';
import { AuthenticationMethodModule } from 'src/authentication_method/authentication_method.module';

@Module({
  imports: [
    RoleModule,
    CityModule,
    ConfigModule,
    CampusModule,
    DniTypeModule,
    CountryModule,
    CompanyModule,
    EmployeeModule,
    DirectionModule,
    SubCompanyModule,
    SuperadminModule,
    CoordinatorModule,
    AdministratorModule,
    AuthenticationMethodModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedModule],
})
export class SeedModule {}

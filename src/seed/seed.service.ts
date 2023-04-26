import { ConfigService } from '@nestjs/config';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CityService } from 'src/city/city.service';
import { RoleService } from 'src/role/role.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { CountryService } from 'src/country/country.service';
import { DniTypeService } from 'src/dni_type/dni_type.service';
import { DirectionService } from 'src/direction/direction.service';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import { AuthenticationMethodService } from 'src/authentication_method/authentication_method.service';
import { CompanyService } from 'src/company/company.service';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import { CampusService } from 'src/campus/campus.service';
import { AdministratorService } from 'src/administrator/administrator.service';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class SeedService {
  constructor(
    @Inject(SuperadminService)
    private superadminService: SuperadminService,
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject(RoleService)
    private roleService: RoleService,
    @Inject(AuthenticationMethodService)
    private authenticationMethodService: AuthenticationMethodService,
    @Inject(DirectionService)
    private directionService: DirectionService,
    @Inject(DniTypeService)
    private dniTypeService: DniTypeService,
    @Inject(CountryService)
    private countryService: CountryService,
    @Inject(CityService)
    private cityService: CityService,
    @Inject(CompanyService)
    private companyService: CompanyService,
    @Inject(SubCompanyService)
    private subCompanyService: SubCompanyService,
    @Inject(CampusService)
    private campusService: CampusService,
    @Inject(AdministratorService)
    private administratorService: AdministratorService,
    @Inject(CoordinatorService)
    private coordinatorService: CoordinatorService,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
  ) {}

  async create(createSeedDto: CreateSeedDto) {
    try {
      // CREATE ROLES
      const roles = [
        'superadmin',
        'administrator',
        'coordinator',
        'employee',
        'vehicle',
      ];
      for (let role of roles) {
        await this.roleService.create({ name: role });
      }
      // CREATE DIRECTION
      const directions = [
        {
          key: 'exit',
          name: 'Salida',
        },
        {
          key: 'entry',
          name: 'Entrada',
        },
      ];
      for (let direction of directions) {
        const { key, name } = direction;
        await this.directionService.create({ key, name });
      }
      // CREATE DNI TYPES
      const dniTypes = [
        'Pasaporte',
        'Cédula de cuidadanía',
        'Tarjeta de identidad',
        'Cédula de extranjería',
      ];
      for (let dniType of dniTypes) {
        await this.dniTypeService.create({ name: dniType });
      }
      // CREATE COUNTRY
      const countryCreated = await this.countryService.create({
        name: 'Colombia',
      });
      const countryId = countryCreated._id.toString();
      // CREATE CITIES
      await this.cityService.create({ country: countryId });
      const cities = await this.cityService.findAll();
      const apartadoCity = cities.find((city) => city.name === 'Apartadó');
      const apartadoCityId = apartadoCity._id.toString();

      // CREATE SUPERADMIN
      const superadminUsername = 'cotema_superadmin';
      const superadminPassword = '&O!Tsmk%M7b86WmZ';
      const ROOT_PASSWORD = this.configService.get('ROOT_PASSWORD');
      const superadminCreated = await this.superadminService.create({
        username: superadminUsername,
        password: superadminPassword,
        root_password: ROOT_PASSWORD,
      });

      // CREATE AUTH METHODS
      const authMethods = [
        {
          key: 'fingerprint',
          name: 'Huella dactilar',
        },
        {
          key: 'barcode',
          name: 'Código de barras',
        },
        {
          key: 'rfid',
          name: 'RFID',
        },
      ];
      for (let method of authMethods) {
        const { key, name } = method;
        await this.authenticationMethodService.create({ key, name });
      }

      // CREATE COMPANY
      const companyCreated = await this.companyService.create({
        city: apartadoCityId,
        name: 'Cotema',
      });
      const companyId = companyCreated._id.toString();
      // CREATE SUB COMPANY
      const subCompanyCreated = await this.subCompanyService.create({
        city: apartadoCityId,
        company: companyId,
        name: 'Cotema',
      });
      const subCompanyId = subCompanyCreated._id.toString();
      // CREATE CAMPUS
      const campusCreated = await this.campusService.create({
        name: 'Cotema',
        sub_company: subCompanyId,
      });
      const campusId = campusCreated._id.toString();

      // CREATE ADMINISTRATOR
      const adminCreated = await this.administratorService.create({
        company: companyId,
        email: 'cotema_admin@cotema.com',
        password: 'K@4vpw%0h4RT',
        username: 'cotema_admin',
      });
      // CREATE AN EMPLOYEE

      // CREATE COORDINATOR
      // const coordinatorCreated = await this.coordinatorService.create({
      //   campus: campusId,
      //   company: companyId,

      // })
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findAll() {
    return `This action returns all seed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seed`;
  }

  update(id: number, updateSeedDto: UpdateSeedDto) {
    return `This action updates a #${id} seed`;
  }

  remove(id: number) {
    return `This action removes a #${id} seed`;
  }
}

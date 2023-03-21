import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleService } from 'src/role/role.service';
import { CityService } from 'src/city/city.service';
import { CountryService } from 'src/country/country.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DniTypeService } from 'src/dni_type/dni_type.service';
import { CategoryService } from 'src/category/category.service';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    @Inject(RoleService)
    private roleService: RoleService,
    @Inject(CityService)
    private cityService: CityService,
    @Inject(CountryService)
    private countryService: CountryService,
    @Inject(DniTypeService)
    private dniTypeService: DniTypeService,
    @Inject(SubCompanyService)
    private subCompanyService: SubCompanyService,
    @Inject(CategoryService)
    private categoryService: CategoryService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const {
        role,
        city,
        country,
        dni_type,
        sub_company,
        first_category,
        second_category,
      } = createEmployeeDto;
      if (city) {
        await this.cityService.documentExists(city);
      }
      if (country) {
        await this.countryService.documentExists(country);
      }
      if (second_category) {
        await this.categoryService.documentExists(second_category);
      }
      await this.roleService.documentExists(role);
      await this.dniTypeService.documentExists(dni_type);
      await this.subCompanyService.documentExists(sub_company);
      await this.categoryService.documentExists(first_category);

      const newEmployee = new this.employeeModel(createEmployeeDto);
      const employeeCreated = await newEmployee.save();
      console.log('Employee created succesfully');
      return employeeCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Employee[]> {
    try {
      const employeesFound = await this.employeeModel
        .find()
        .populate('role')
        .populate('city')
        .populate('country')
        .populate('dni_type')
        .populate('sub_company')
        .populate('first_category')
        .populate('second_category')
        .exec();
      console.log('Employees found successfully');
      return employeesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.employeeModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Employee with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOne(id: string): Promise<Employee> {
    try {
      const employeeFound = await this.employeeModel
        .findById(id)
        .populate('role')
        .populate('city')
        .populate('country')
        .populate('dni_type')
        .populate('sub_company')
        .populate('first_category')
        .populate('second_category')
        .exec();
      console.log('Employee found succesfully');
      return employeeFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<void> {
    try {
      await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto);
      console.log(`Employee with id ${id} was updated succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string) {
    try {
      await this.employeeModel.findByIdAndDelete(id);
      console.log(`Employee with id ${id} was deleted succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { roles_ids } from 'src/utils/role_ids';
import { CityService } from 'src/city/city.service';
import { employeeQuery } from './queries/employeeQuery';
import { CampusService } from 'src/campus/campus.service';
import { CompanyService } from 'src/company/company.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DniTypeService } from 'src/dni_type/dni_type.service';
import { CategoryService } from 'src/category/category.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: mongoose.Model<EmployeeDocument>,
    @Inject(CityService)
    private cityService: CityService,
    @Inject(DniTypeService)
    private dniTypeService: DniTypeService,
    @Inject(SubCompanyService)
    private subCompanyService: SubCompanyService,
    @Inject(CategoryService)
    private categoryService: CategoryService,
    @Inject(CompanyService)
    private companyService: CompanyService,
    @Inject(CampusService)
    private campusService: CampusService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const {
        city,
        campus,
        company,
        dni_type,
        sub_company,
        first_category,
        second_category,
      } = createEmployeeDto;
      if (city) {
        await this.cityService.documentExists(city);
      }
      if (second_category) {
        await this.categoryService.documentExists(second_category);
      }
      await this.campusService.documentExists(campus);
      await this.companyService.documentExists(company);
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

  async findAll(payload: JwtPayload): Promise<Employee[]> {
    try {
      const { sub_company, company } = payload;
      const adminMatch = {
        company: new mongoose.Types.ObjectId(company?._id),
      };
      const coordinatorMatch = {
        sub_company: new mongoose.Types.ObjectId(sub_company?._id),
      };
      const matchQuery =
        payload.role._id === roles_ids.administrator
          ? adminMatch
          : coordinatorMatch;
      const employeesFound = await this.employeeModel.aggregate([
        {
          $match: {
            is_active: true,
            ...matchQuery,
          },
        },
        ...employeeQuery,
      ]);
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
      const employeeFound = await this.employeeModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        ...employeeQuery,
      ]);
      if (employeeFound.length === 0) {
        throw new BadRequestException(`Employee with id ${id} does not exists`);
      }
      console.log('Employee found succesfully');
      return employeeFound[0];
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

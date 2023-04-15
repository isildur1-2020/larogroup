import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CityService } from 'src/city/city.service';
import { RoleService } from 'src/role/role.service';
import { employeeQuery } from './queries/employeeQuery';
import { CampusService } from 'src/campus/campus.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DniTypeService } from 'src/dni_type/dni_type.service';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { filePath } from 'src/utils/filePath';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: mongoose.Model<EmployeeDocument>,
    @Inject(CityService)
    private cityService: CityService,
    @Inject(DniTypeService)
    private dniTypeService: DniTypeService,
    @Inject(CampusService)
    private campusService: CampusService,
    @Inject(RoleService)
    private roleService: RoleService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const { city, campus, dni_type, categories, email } = createEmployeeDto;
      await this.cityService.documentExists(city);
      await this.campusService.documentExists(campus);
      await this.dniTypeService.documentExists(dni_type);
      const roleFound = await this.roleService.findOneByName(
        ValidRoles.employee,
      );
      const newEmployee = new this.employeeModel({
        ...createEmployeeDto,
        email: email.toLowerCase(),
        role: roleFound._id.toString(),
      });
      const employeeCreated: Employee = await newEmployee.save();
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
      console.log({ sub_company, company });
      const employeesFound = await this.employeeModel.aggregate([
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
      await this.documentExists(id);
      await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto);
      console.log(`Employee with id ${id} was updated succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async uploadProfilePicture(
    id: string,
    file: Express.Multer.File,
  ): Promise<void> {
    try {
      if (!file) {
        throw new BadRequestException('The fingerprint file is required');
      }
      const profile_picture = file.filename;
      await this.employeeModel.findByIdAndUpdate(id, { profile_picture });
      console.log('Profile picture upload succesfully');
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string) {
    try {
      await this.documentExists(id);
      await this.employeeModel.findByIdAndDelete(id);
      console.log(`Employee with id ${id} was deleted succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneByData(data: object): Promise<Employee> {
    try {
      const employeeFound = await this.employeeModel.findOne(data);
      if (employeeFound === null) {
        throw new BadRequestException(
          'Not employee found with this data parameters',
        );
      }
      return employeeFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

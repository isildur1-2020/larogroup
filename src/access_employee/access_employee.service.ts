import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeService } from 'src/employee/employee.service';
import { AccessGroupService } from 'src/access_group/access_group.service';
import { CreateAccessEmployeeDto } from './dto/create-access_employee.dto';
import { UpdateAccessEmployeeDto } from './dto/update-access_employee.dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  AccessEmployee,
  AccessEmployeeDocument,
} from './entities/access_employee.entity';

@Injectable()
export class AccessEmployeeService {
  constructor(
    @InjectModel(AccessEmployee.name)
    private accessEmployeeModel: Model<AccessEmployeeDocument>,
    @Inject(AccessGroupService)
    private accessGroupService: AccessGroupService,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
  ) {}

  async create(
    createAccessEmployeeDto: CreateAccessEmployeeDto,
  ): Promise<AccessEmployee> {
    try {
      const { access_group, employee } = createAccessEmployeeDto;
      await this.accessGroupService.documentExists(access_group);
      await this.employeeService.documentExists(employee);
      const newAccessEmployee = new this.accessEmployeeModel(
        createAccessEmployeeDto,
      );
      const accessEmployeeCreated = await newAccessEmployee.save();
      console.log('Access employee created successfully');
      return accessEmployeeCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<AccessEmployee[]> {
    try {
      const accessEmployeesFound = await this.accessEmployeeModel
        .find()
        .populate('access_group')
        .populate('employee');
      console.log('Access employees found successfully');
      return accessEmployeesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateAccessEmployeeDto: UpdateAccessEmployeeDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.accessEmployeeModel.findByIdAndDelete(id);
      console.log(`Access employee with id ${id} was deleted succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CityService } from 'src/city/city.service';
import { RoleService } from 'src/role/role.service';
import { CampusService } from 'src/campus/campus.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DniTypeService } from 'src/dni_type/dni_type.service';
import { employeeQuery } from 'src/common/queries/employeeQuery';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { ProfilePictureService } from 'src/profile_picture/profile_picture.service';
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';

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
    @Inject(ProfilePictureService)
    private profilePictureService: ProfilePictureService,
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const { city, campus, dni_type, email, barcode } = createEmployeeDto;
      await this.vehicleService.verifyVehicleWithBarcode(barcode);
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
      // const { sub_company, company } = payload;
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
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
      const employeeFound = await this.findOne(id);
      const bodyPictureId = updateEmployeeDto?.profile_picture;
      const barcodeData = updateEmployeeDto?.barcode;
      if (barcodeData) {
        const entityExists = await this.vehicleService.findOneByBarcode(
          barcodeData,
        );
        if (entityExists) {
          throw new BadRequestException('This barcode is already in use');
        }
      }
      if (bodyPictureId) {
        const existsPicture = employeeFound.profile_picture;
        if (existsPicture.length === 0) {
          await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto);
        } else {
          const currentProfilePictureId = existsPicture[0]._id.toString();
          const isSamePictureId = bodyPictureId === currentProfilePictureId;
          if (isSamePictureId) {
            throw new BadRequestException('Is the same picture profile');
          }
          await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto);
          await this.profilePictureService.remove(currentProfilePictureId);
        }
      }
      await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto);
      console.log(`Employee with id ${id} was updated succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string) {
    try {
      const employeeFound = await this.findOne(id);
      await this.employeeModel.findByIdAndDelete(id);
      const currentPicture = employeeFound.profile_picture;
      if (currentPicture.length !== 0) {
        const currentPictureId = currentPicture[0]._id.toString();
        await this.profilePictureService.remove(currentPictureId);
      }
      console.log(`Employee with id ${id} was deleted succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async verifyEmployeeWithBarcode(barcode: string): Promise<void> {
    try {
      const employeeFound = await this.employeeModel.findOne({ barcode });
      if (employeeFound !== null) {
        throw new BadRequestException(
          'Already exists a employee with this barcode number',
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneByBarcode(barcode: string): Promise<Employee> {
    try {
      const employeeFound = await this.employeeModel.aggregate([
        { $match: { barcode } },
        ...employeeQuery,
      ]);
      console.log('Employee found with barcode successfully');
      return employeeFound?.[0];
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneByRfid(rfid: string): Promise<Employee> {
    try {
      const employeeFound = await this.employeeModel.aggregate([
        { $match: { rfid } },
        ...employeeQuery,
      ]);
      console.log('Employee found with RFID successfully');
      return employeeFound?.[0];
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

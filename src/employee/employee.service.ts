import * as path from 'path';
import * as mongoose from 'mongoose';
import { filePath } from 'src/utils/filePath';
import { InjectModel } from '@nestjs/mongoose';
import { xlsxToJson } from '../utils/xlsxToJson';
import { CityService } from 'src/city/city.service';
import { RoleService } from 'src/role/role.service';
import { CampusService } from 'src/campus/campus.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DniTypeService } from 'src/dni_type/dni_type.service';
import { CategoryService } from 'src/category/category.service';
import { employeeQuery } from 'src/common/queries/employeeQuery';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { FingerprintService } from 'src/fingerprint/fingerprint.service';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import { AccessGroupService } from 'src/access_group/access_group.service';
import { ProfilePictureService } from 'src/profile_picture/profile_picture.service';
import { AuthenticationRecordService } from 'src/authentication_record/authentication_record.service';
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
    @Inject(forwardRef(() => CityService))
    private cityService: CityService,
    @Inject(forwardRef(() => DniTypeService))
    private dniTypeService: DniTypeService,
    @Inject(forwardRef(() => CampusService))
    private campusService: CampusService,
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
    @Inject(ProfilePictureService)
    private profilePictureService: ProfilePictureService,
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
    @Inject(forwardRef(() => CoordinatorService))
    private coordinatorService: CoordinatorService,
    @Inject(forwardRef(() => FingerprintService))
    private fingerprintService: FingerprintService,
    @Inject(forwardRef(() => AuthenticationRecordService))
    private authenticationRecordService: AuthenticationRecordService,
    @Inject(CategoryService)
    private categoryService: CategoryService,
    @Inject(forwardRef(() => AccessGroupService))
    private accessGroupService: AccessGroupService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      let { city, campus, dni_type, email, barcode, access_group, categories } =
        createEmployeeDto;
      access_group = JSON.parse(access_group);
      categories = JSON.parse(categories);
      await this.vehicleService.verifyVehicleWithBarcode(barcode);
      await this.cityService.documentExists(city);
      await this.campusService.documentExists(campus);
      await this.dniTypeService.documentExists(dni_type);
      const roleFound = await this.roleService.findOneByName(
        ValidRoles.employee,
      );
      const newEmployee = new this.employeeModel({
        ...createEmployeeDto,
        categories,
        access_group,
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

  async uploadEmployees() {
    try {
      let dataPromises: any[] = [];
      let employeeCategories: string[] | string;
      let employeeAccessGroup: string[] | string;
      const sourceFile = path.join(
        __dirname,
        '../../',
        filePath.root,
        filePath.templates,
        'employeesTemplate.xlsx',
      );
      const employeesData: CreateEmployeeDto[] = xlsxToJson(sourceFile);
      for (let employee of employeesData) {
        const { categories, access_group } = employee;
        // VALIDATE CATEGORIES
        const moreThanOneCategory = categories.includes(',');
        if (moreThanOneCategory) {
          const categoriesIds = categories.split(',');
          for (let id of categoriesIds) {
            const isValidId = mongoose.isValidObjectId(id);
            if (!isValidId) {
              throw new BadRequestException(
                `Invalid mongo id ${id} - dni ${employee.dni}`,
              );
            }
            await this.categoryService.documentExists(id);
          }
          employeeCategories = categoriesIds;
        } else {
          await this.categoryService.documentExists(categories);
          employeeCategories = categories;
        }
        // ACCESS_GROUP
        const moreThanOneAccessGroup = access_group.includes(',');
        if (moreThanOneAccessGroup) {
          const accessGroupIds = access_group.split(',');
          for (let id of accessGroupIds) {
            const isValidId = mongoose.isValidObjectId(id);
            if (!isValidId) {
              throw new BadRequestException(
                `Invalid mongo id ${id} - dni ${employee.dni}`,
              );
            }
            await this.accessGroupService.documentExists(id);
          }
          employeeAccessGroup = accessGroupIds;
        } else {
          await this.accessGroupService.documentExists(access_group);
          employeeAccessGroup = access_group;
        }
        // CREATE
        const employeePromise = this.create({
          ...employee,
          categories: JSON.stringify(employeeCategories),
          access_group: JSON.stringify(employeeAccessGroup),
        });
        dataPromises.push(employeePromise);
        // console.log(`Employee created - dni ${employee.dni}`);
      }
      await Promise.all(dataPromises);
      return {
        message: 'Empleados creados exitosamente',
      };
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
      // RESTRICT DELETE
      await this.authenticationRecordService.validateByEmployee(id);
      await this.coordinatorService.validateByEmployee(id);
      // REMOVE FINGERPRINTS
      const employeeId = employeeFound._id.toString();
      const fingerprintsFound =
        await this.fingerprintService.findFingerprintsByEmployee(employeeId);
      if (fingerprintsFound.length > 0) {
        for (let fingerprint of fingerprintsFound) {
          const fingerprintId = fingerprint._id.toString();
          await this.fingerprintService.remove(fingerprintId);
        }
      }
      // REMOVE PROFILE PICTURE
      const currentPicture = employeeFound.profile_picture;
      if (currentPicture.length !== 0) {
        const currentPictureId = currentPicture[0]._id.toString();
        await this.profilePictureService.remove(currentPictureId);
      }

      await this.employeeModel.findByIdAndDelete(id);
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

  async validateByRole(role: string): Promise<void> {
    try {
      const employeesFound = await this.employeeModel.find({ role });
      if (employeesFound.length > 0) {
        throw new BadRequestException('There are associated employees');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByCity(city: string): Promise<void> {
    try {
      const employeesFound = await this.employeeModel.find({ city });
      if (employeesFound.length > 0) {
        throw new BadRequestException('There are associated employees');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByDniType(dni_type: string): Promise<void> {
    try {
      const employeesFound = await this.employeeModel.find({ dni_type });
      if (employeesFound.length > 0) {
        throw new BadRequestException('There are associated employees');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByCampus(campus: string): Promise<void> {
    try {
      const employeesFound = await this.employeeModel.find({ campus });
      if (employeesFound.length > 0) {
        throw new BadRequestException('There are associated employees');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByCategory(categories: string): Promise<void> {
    try {
      const employeesFound = await this.employeeModel.find({ categories });
      if (employeesFound.length > 0) {
        throw new BadRequestException('There are associated employees');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByAccessGroup(access_group: string): Promise<void> {
    try {
      const employeesFound = await this.employeeModel.find({ access_group });
      if (employeesFound.length > 0) {
        throw new BadRequestException('There are associated employees');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

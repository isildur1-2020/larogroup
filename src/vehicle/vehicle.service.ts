import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import { filePath } from 'src/utils/filePath';
import { InjectModel } from '@nestjs/mongoose';
import { xlsxToJson } from 'src/utils/xlsxToJson';
import { RoleService } from 'src/role/role.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { vehicleQuery } from 'src/common/queries/vehicleQuery';
import { EmployeeService } from 'src/employee/employee.service';
import { Vehicle, VehicleDocument } from './entities/vehicle.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { AccessGroupService } from 'src/access_group/access_group.service';
import { ProfilePictureService } from 'src/profile_picture/profile_picture.service';
import { AuthenticationRecordService } from 'src/authentication_record/authentication_record.service';
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name)
    private vehicleModel: mongoose.Model<VehicleDocument>,
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(ProfilePictureService)
    private profilePictureService: ProfilePictureService,
    @Inject(forwardRef(() => AuthenticationRecordService))
    private authenticationRecordService: AuthenticationRecordService,
    @Inject(forwardRef(() => AccessGroupService))
    private accessGroupService: AccessGroupService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      let { barcode } = createVehicleDto;
      await this.employeeService.verifyEmployeeWithBarcode(barcode);
      const roleFound = await this.roleService.findOneByName(
        ValidRoles.vehicle,
      );
      const newVehicle = new this.vehicleModel({
        ...createVehicleDto,
        role: roleFound._id.toString(),
      });
      const vehicleSaved = await newVehicle.save();
      console.log('Vehicle saved successfully');
      return vehicleSaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Vehicle[]> {
    try {
      const vehiclesFound = await this.vehicleModel.aggregate([
        ...vehicleQuery,
      ]);
      console.log('Vehicles found successfully');
      return vehiclesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async verifyVehicleWithBarcode(barcode: string): Promise<void> {
    try {
      const vehicleFound = await this.vehicleModel.findOne({ barcode });
      if (vehicleFound !== null) {
        throw new BadRequestException(
          'Already exists a vehicle with this barcode number',
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.vehicleModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Vehicle with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findById(id: string): Promise<Vehicle> {
    try {
      const vehicleFound = await this.vehicleModel.findById(id);
      if (vehicleFound === null) {
        throw new BadRequestException(`Vehicle with id ${id} does not exists`);
      }
      return vehicleFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneByBarcode(barcode: string): Promise<Vehicle> {
    try {
      const vehicleFound = await this.vehicleModel.aggregate([
        { $match: { barcode } },
        ...vehicleQuery,
      ]);
      console.log('Employee found with barcode successfully');
      return vehicleFound?.[0];
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async updateCurrentZone(id: string, current_zone: string): Promise<void> {
    try {
      await this.vehicleModel.findByIdAndUpdate(id, { current_zone });
    } catch (err) {
      throw new InternalServerErrorException(
        'Error to attemp update current_zone',
      );
    }
  }

  async uploadVehicles(file: Express.Multer.File) {
    const sourceFile = path.join(
      __dirname,
      '../../',
      filePath.root,
      filePath.temporal,
      file.filename,
    );
    try {
      let dataPromises: any[] = [];
      let vehiclesAccessGroup: string[] | string;
      const vehiclesData: CreateVehicleDto[] = xlsxToJson(sourceFile);
      console.log(vehiclesData);
      for (let vehicle of vehiclesData) {
        const { access_group } = vehicle;
        // ACCESS_GROUP
        const moreThanOneAccessGroup = access_group.includes(',');
        if (moreThanOneAccessGroup) {
          const accessGroupIds = access_group.split(',');
          for (let id of accessGroupIds) {
            const isValidId = mongoose.isValidObjectId(id);
            if (!isValidId) {
              throw new BadRequestException(
                `Invalid mongo id ${id} - dni ${vehicle.plate}`,
              );
            }
            await this.accessGroupService.documentExists(id);
          }
          vehiclesAccessGroup = accessGroupIds;
        } else {
          await this.accessGroupService.documentExists(access_group);
          vehiclesAccessGroup = access_group;
        }
        // CREATE
        let { barcode } = vehicle;
        await this.employeeService.verifyEmployeeWithBarcode(barcode);
        const roleFound = await this.roleService.findOneByName(
          ValidRoles.vehicle,
        );
        const newVehicle = new this.vehicleModel({
          ...vehicle,
          access_group: vehiclesAccessGroup,
          role: roleFound._id.toString(),
        });
        const vehicleSaved = newVehicle.save();
        dataPromises.push(vehicleSaved);
      }
      await Promise.all(dataPromises);
      return {
        message: 'Vehiculos creados exitosamente',
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    } finally {
      fs.unlinkSync(sourceFile);
    }
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<void> {
    try {
      await this.documentExists(id);
      const barcodeData = updateVehicleDto?.barcode;
      if (barcodeData) {
        const entityExists = await this.employeeService.findOneByBarcode(
          barcodeData,
        );
        if (entityExists) {
          throw new BadRequestException('This barcode is already in use');
        }
      }
      await this.vehicleModel.findByIdAndUpdate(id, updateVehicleDto);
      console.log(`Vehicle with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const vehicleFound = await this.findById(id);
      // RESTRICT DELETE
      await this.authenticationRecordService.validateByVehicle(id);
      // DELETE PROFILE PICTURE
      if (vehicleFound?.profile_picture) {
        const { profile_picture } = vehicleFound;
        await this.profilePictureService.remove(profile_picture.toString());
      }
      await this.vehicleModel.findByIdAndDelete(id);
      console.log(`Vehicle with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByRole(role: string): Promise<void> {
    try {
      const vehiclesFound = await this.vehicleModel.find({ role });
      if (vehiclesFound.length > 0) {
        throw new BadRequestException('There are associated vehicles');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByAccessGroup(access_group: string): Promise<void> {
    try {
      const vehiclesFound = await this.vehicleModel.find({ access_group });
      if (vehiclesFound.length > 0) {
        throw new BadRequestException('There are associated vehicles');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

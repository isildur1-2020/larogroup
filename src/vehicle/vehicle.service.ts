import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleService } from 'src/role/role.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { vehicleQuery } from 'src/common/queries/vehicleQuery';
import { EmployeeService } from 'src/employee/employee.service';
import { Vehicle, VehicleDocument } from './entities/vehicle.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ProfilePictureService } from 'src/profile_picture/profile_picture.service';
import { AuthenticationRecordService } from 'src/authentication_record/authentication_record.service';
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<VehicleDocument>,
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(ProfilePictureService)
    private profilePictureService: ProfilePictureService,
    @Inject(forwardRef(() => AuthenticationRecordService))
    private authenticationRecordService: AuthenticationRecordService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      const { barcode } = createVehicleDto;
      await this.employeeService.verifyEmployeeWithBarcode(barcode);
      const roleFound = await this.roleService.findOneByName(
        ValidRoles.vehicle,
      );
      const newVehicle = new this.vehicleModel({
        role: roleFound._id.toString(),
        ...createVehicleDto,
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

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleService } from 'src/role/role.service';
import { roleQuery } from 'src/common/queries/roleQuery';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { Vehicle, VehicleDocument } from './entities/vehicle.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { profilePictureQuery } from 'src/common/queries/profilePictureQuery';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<VehicleDocument>,
    @Inject(RoleService)
    private roleService: RoleService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
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
        ...roleQuery,
        ...profilePictureQuery,
        {
          $project: {
            is_active: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
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

  findOne(id: number) {
    throw new NotFoundException();
  }

  async findOneByBarcode(barcode: string): Promise<Vehicle> {
    try {
      const vehicleFound = await this.vehicleModel.findOne({ barcode });
      console.log('Vehicle found with barcode successfully');
      return vehicleFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<void> {
    try {
      await this.documentExists(id);
      await this.vehicleModel.findByIdAndUpdate(id, updateVehicleDto);
      console.log(`Vehicle with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      await this.vehicleModel.findByIdAndDelete(id);
      console.log(`Vehicle with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

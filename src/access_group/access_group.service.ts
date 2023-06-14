import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { deviceQuery } from 'src/common/queries/deviceQuery';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateAccessGroupDto } from './dto/create-access_group.dto';
import { UpdateAccessGroupDto } from './dto/update-access_group.dto';
import { subcompanyQuery } from 'src/common/queries/subcompanyQuery';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import { AuthenticationRecordService } from 'src/authentication_record/authentication_record.service';
import {
  Inject,
  forwardRef,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  AccessGroup,
  AccessGroupDocument,
} from './entities/access_group.entity';

@Injectable()
export class AccessGroupService {
  constructor(
    @InjectModel(AccessGroup.name)
    private accessGroupModel: Model<AccessGroupDocument>,
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(forwardRef(() => SubCompanyService))
    private subCompanyService: SubCompanyService,
    @Inject(forwardRef(() => AuthenticationRecordService))
    private authenticationRecordService: AuthenticationRecordService,
  ) {}

  async create(
    createAccessGroupDto: CreateAccessGroupDto,
  ): Promise<AccessGroup> {
    try {
      const { sub_company } = createAccessGroupDto;
      await this.subCompanyService.documentExists(sub_company);
      const newAccessGroup = new this.accessGroupModel(createAccessGroupDto);
      const accessGroupSaved = await newAccessGroup.save();
      console.log('Access group created successfully');
      return accessGroupSaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<AccessGroup[]> {
    try {
      const accessGroupsFound = await this.accessGroupModel.aggregate([
        ...subcompanyQuery,
        ...deviceQuery,
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Access groups found successfully');
      return accessGroupsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findByDevice(device_id: string): Promise<AccessGroup[]> {
    try {
      const accessGroupFound = await this.accessGroupModel.aggregate([
        { $match: { device: new mongoose.Types.ObjectId(device_id) } },
        ...deviceQuery,
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Access groups by device id found successfully');
      return accessGroupFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.accessGroupModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(
          `Access group with id ${id} does not exists`,
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  async update(
    id: string,
    updateAccessGroupDto: UpdateAccessGroupDto,
  ): Promise<void> {
    try {
      await this.documentExists(id);
      await this.accessGroupModel.findByIdAndUpdate(id, updateAccessGroupDto);
      console.log(`Access group was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      // RESTRICT DELETE
      await this.authenticationRecordService.validateByAccessGroup(id);
      await this.employeeService.validateByAccessGroup(id);
      await this.vehicleService.validateByAccessGroup(id);
      await this.accessGroupModel.findByIdAndDelete(id);
      console.log(`Access group with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateBySubCompany(sub_company: string): Promise<void> {
    try {
      const accessGroupsFound = await this.accessGroupModel.find({
        sub_company,
      });
      if (accessGroupsFound.length > 0) {
        throw new BadRequestException('There are associated an access group');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByDevice(device: string): Promise<void> {
    try {
      const accessGroupsFound = await this.accessGroupModel.find({
        device,
      });
      if (accessGroupsFound.length > 0) {
        throw new BadRequestException('There are associated an access group');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

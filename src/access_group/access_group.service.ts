import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { deviceQuery } from 'src/common/queries/deviceQuery';
import { CreateAccessGroupDto } from './dto/create-access_group.dto';
import { UpdateAccessGroupDto } from './dto/update-access_group.dto';
import { subcompanyQuery } from 'src/common/queries/subcompanyQuery';
import {
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
  ) {}

  async create(
    createAccessGroupDto: CreateAccessGroupDto,
  ): Promise<AccessGroup> {
    try {
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
      const accessGroupFound = this.accessGroupModel.aggregate([
        { $match: { device: new mongoose.Types.ObjectId(device_id) } },
        ...deviceQuery,
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Accessgroup by device id found successfully');
      return accessGroupFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findDevicesCountById(id: string): Promise<number> {
    try {
      const accessGroupFound: AccessGroup =
        await this.accessGroupModel.findById(id);
      const devicesCount = accessGroupFound.device.length;
      console.log('Devices count found successfully');
      return devicesCount;
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
      await this.accessGroupModel.findByIdAndDelete(id);
      console.log(`Access group with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAccessGroupDto } from './dto/create-access_group.dto';
import { UpdateAccessGroupDto } from './dto/update-access_group.dto';
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
      const accessGroupsFound = await this.accessGroupModel.find();
      console.log('Access groups found successfully');
      return accessGroupsFound;
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

  update(id: number, updateAccessGroupDto: UpdateAccessGroupDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.accessGroupModel.findByIdAndDelete(id);
      console.log(`Access group with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

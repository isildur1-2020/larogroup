import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceService } from 'src/device/device.service';
import { CreateAccessDeviceDto } from './dto/create-access_device.dto';
import { UpdateAccessDeviceDto } from './dto/update-access_device.dto';
import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AccessGroupService } from 'src/access_group/access_group.service';
import {
  AccessDevice,
  AccessDeviceDocument,
} from './entities/access_device.entity';

@Injectable()
export class AccessDeviceService {
  constructor(
    @InjectModel(AccessDevice.name)
    private accessDeviceModel: Model<AccessDeviceDocument>,
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(AccessGroupService)
    private accessGroupService: AccessGroupService,
  ) {}

  async create(
    createAccessDeviceDto: CreateAccessDeviceDto,
  ): Promise<AccessDevice> {
    try {
      const { device, access_group } = createAccessDeviceDto;
      await this.deviceService.documentExists(device);
      await this.accessGroupService.documentExists(access_group);
      const newAccessDevice = new this.accessDeviceModel(createAccessDeviceDto);
      const accessDeviceCreated = await newAccessDevice.save();
      console.log('Access device created successfully');
      return accessDeviceCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<AccessDevice[]> {
    try {
      const accessDevicesFound = await this.accessDeviceModel
        .find()
        .populate('device')
        .populate('access_group')
        .exec();
      console.log('Access devices found successfully');
      return accessDevicesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateAccessDeviceDto: UpdateAccessDeviceDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.accessDeviceModel.findByIdAndDelete(id);
      console.log(`Access device with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

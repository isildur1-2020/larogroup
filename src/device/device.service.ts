import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { CampusService } from 'src/campus/campus.service';
import { Device, DeviceDocument } from './entities/device.entity';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name)
    private deviceModel: Model<DeviceDocument>,
    @Inject(CampusService)
    private campusService: CampusService,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    try {
      const { campus } = createDeviceDto;
      await this.campusService.documentExists(campus);
      const newDevice = new this.deviceModel(createDeviceDto);
      const deviceSaved = newDevice.save();
      console.log('Device created successfully');
      return deviceSaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Device[]> {
    try {
      const devicesFound = await this.deviceModel
        .find()
        .populate('campus')
        .exec();
      console.log('Devices found successfully');
      return devicesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.deviceModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Device with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneBySN(sn: string): Promise<Device> {
    try {
      const deviceFound = await this.deviceModel.findOne({ sn });
      if (deviceFound === null) {
        throw new BadRequestException(`Device with sn ${sn} does not exists`);
      }
      console.log('Device found succesfully');
      return deviceFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.deviceModel.findByIdAndDelete(id);
      console.log(`Device with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async changeStatus(id: string, status: boolean): Promise<void> {
    try {
      await this.deviceModel.findByIdAndUpdate(id, { is_online: status });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

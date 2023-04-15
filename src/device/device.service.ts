import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { CampusService } from 'src/campus/campus.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { ReasonService } from 'src/reason/reason.service';
import { campusQuery } from 'src/common/queries/campusQuery';
import { Device, DeviceDocument } from './entities/device.entity';
import { directionQuery } from 'src/common/queries/directionQuery';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name)
    private deviceModel: Model<DeviceDocument>,
    @Inject(CampusService)
    private campusService: CampusService,
    @Inject(ReasonService)
    private reasonService: ReasonService,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    try {
      const { campus, direction } = createDeviceDto;
      await this.campusService.documentExists(campus);
      await this.reasonService.documentExists(direction);
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
      const devicesFound = await this.deviceModel.aggregate([
        ...directionQuery,
        ...campusQuery,
      ]);
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

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<void> {
    try {
      await this.documentExists(id);
      await this.deviceModel.findByIdAndUpdate(id, updateDeviceDto);
      console.log(`Device with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      await this.deviceModel.findByIdAndDelete(id);
      console.log(`Device with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async changeStatus(
    id: string,
    changeStatusDto: ChangeStatusDto,
  ): Promise<void> {
    try {
      await this.documentExists(id);
      const { is_online } = changeStatusDto;
      await this.deviceModel.findByIdAndUpdate(id, { is_online });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IsOnlineDto } from './dto/is-online.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { CampusService } from 'src/campus/campus.service';
import { campusQuery } from 'src/common/queries/campusQuery';
import { Device, DeviceDocument } from './entities/device.entity';
import { directionQuery } from 'src/common/queries/directionQuery';
import { DirectionService } from 'src/direction/direction.service';
import { AccessGroupService } from 'src/access_group/access_group.service';
import { AuthenticationRecordService } from 'src/authentication_record/authentication_record.service';
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name)
    private deviceModel: Model<DeviceDocument>,
    @Inject(forwardRef(() => CampusService))
    private campusService: CampusService,
    @Inject(forwardRef(() => DirectionService))
    private directionService: DirectionService,
    @Inject(forwardRef(() => AccessGroupService))
    private accessGroupService: AccessGroupService,
    @Inject(forwardRef(() => AuthenticationRecordService))
    private authenticationRecordService: AuthenticationRecordService,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    try {
      const { campus, direction } = createDeviceDto;
      await this.campusService.documentExists(campus);
      await this.directionService.documentExists(direction);
      console.log(createDeviceDto);
      const newDevice = new this.deviceModel(createDeviceDto);
      const deviceSaved = await newDevice.save();
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
      const deviceFound = await this.deviceModel.aggregate([
        { $match: { sn } },
        ...directionQuery,
      ]);
      if (deviceFound.length === 0) {
        throw new BadRequestException(`Device with sn ${sn} does not exists`);
      }
      console.log('Device found succesfully');
      return deviceFound[0];
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

  async updatebySN(
    sn: string,
    isOnlineDto: IsOnlineDto,
  ): Promise<{ err: boolean; message: string }> {
    try {
      const deviceFound = await this.findOneBySN(sn);
      await this.deviceModel.findByIdAndUpdate(deviceFound._id, isOnlineDto);
      const message = `Device with sn ${sn} was updated successfully`;
      console.log(message);
      return { err: false, message };
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ err: true, message: err.message });
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      // RESTRICT DELETE
      await this.authenticationRecordService.validateByDevice(id);
      await this.accessGroupService.validateByDevice(id);
      await this.deviceModel.findByIdAndDelete(id);
      console.log(`Device with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByDirection(direction: string): Promise<void> {
    try {
      const devicesFound = await this.deviceModel.find({ direction });
      if (devicesFound.length > 0) {
        throw new BadRequestException('There are associated devices');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByCampus(campus: string): Promise<void> {
    try {
      const devicesFound = await this.deviceModel.find({ campus });
      if (devicesFound.length > 0) {
        throw new BadRequestException('There are associated devices');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

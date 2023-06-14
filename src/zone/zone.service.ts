import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { DeviceService } from 'src/device/device.service';
import { Zone, ZoneDocument } from './entities/zone.entity';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ZoneService {
  constructor(
    @InjectModel(Zone.name)
    private zoneModel: mongoose.Model<ZoneDocument>,
    @Inject(forwardRef(() => DeviceService))
    private deviceService: DeviceService,
  ) {}

  async create(createZoneDto: CreateZoneDto): Promise<Zone> {
    try {
      const newZone = new this.zoneModel(createZoneDto);
      const zoneSaved = await newZone.save();
      console.log('Zone created successfully');
      return zoneSaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.zoneModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Zone with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<ZoneDocument[]> {
    try {
      const zonesFound = await this.zoneModel.aggregate([
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Zones found successfully');
      return zonesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: string) {
    throw new NotFoundException();
  }

  async update(id: string, updateZoneDto: UpdateZoneDto): Promise<void> {
    try {
      await this.documentExists(id);
      await this.zoneModel.findByIdAndUpdate(id, updateZoneDto);
      console.log(`Zone with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      // RESTRICTED DELETE
      await this.deviceService.validateByZone(id);
      await this.zoneModel.findByIdAndDelete(id);
      console.log(`Zone with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceService } from 'src/device/device.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { Direction, DirectionDocument } from './entities/direction.entity';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class DirectionService {
  constructor(
    @InjectModel(Direction.name)
    private directionModel: Model<DirectionDocument>,
    @Inject(forwardRef(() => DeviceService))
    private deviceService: DeviceService,
  ) {}

  async create(createDirectionDto: CreateDirectionDto): Promise<Direction> {
    try {
      const newDirection = new this.directionModel(createDirectionDto);
      const directionCreated = await newDirection.save();
      console.log('Direction created successfully');
      return directionCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Direction[]> {
    try {
      const directionsFound = await this.directionModel.aggregate([
        {
          $project: {
            key: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Directions found successfully');
      return directionsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneByName(key: string): Promise<Direction> {
    try {
      const directionFound = await this.directionModel.findOne({ key });
      if (directionFound === null) {
        throw new BadRequestException(
          `Direction with key ${key} does not exists`,
        );
      }
      console.log('Direction found successfully');
      return directionFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.directionModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(
          `Direction with id ${id} does not exists`,
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: string) {
    throw new NotFoundException();
  }

  async update(
    id: string,
    updateDirectionDto: UpdateDirectionDto,
  ): Promise<void> {
    try {
      await this.documentExists(id);
      await this.directionModel.findByIdAndUpdate(id, updateDirectionDto);
      console.log(`Direction with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      // RESTRICT DELETE
      await this.deviceService.validateByDirection(id);
      await this.directionModel.findByIdAndDelete(id);
      console.log(`Direction with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DniType } from './entities/dni_type.entity';
import { CreateDniTypeDto } from './dto/create-dni_type.dto';
import { UpdateDniTypeDto } from './dto/update-dni_type.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class DniTypeService {
  constructor(
    @InjectModel(DniType.name)
    private dniTypeModel: Model<DniType>,
  ) {}

  async create(createDniTypeDto: CreateDniTypeDto): Promise<DniType> {
    try {
      const newDniType = new this.dniTypeModel(createDniTypeDto);
      const dniTypeSaved = await newDniType.save();
      console.log('Dni_type saved successfully');
      return dniTypeSaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<DniType[]> {
    try {
      const dniTypesFound = await this.dniTypeModel.find();
      console.log('Dni types found successfully');
      return dniTypesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.dniTypeModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Dni type with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateDniTypeDto: UpdateDniTypeDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.dniTypeModel.findOneAndDelete({ _id: id });
      console.log(`Dni type with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

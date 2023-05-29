import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateExpulsionDto } from './dto/create-expulsion.dto';
import { UpdateExpulsionDto } from './dto/update-expulsion.dto';
import { expulsionQuery } from 'src/common/queries/expulsionQuery';
import { ExplusionDocument, Expulsion } from './entities/expulsion.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ExpulsionService {
  constructor(
    @InjectModel(Expulsion.name)
    private expulsionModel: Model<ExplusionDocument>,
  ) {}

  async create(createExpulsionDto: CreateExpulsionDto): Promise<Expulsion> {
    try {
      const newExpulsion = new this.expulsionModel(createExpulsionDto);
      const expulsionCreated = await newExpulsion.save();
      console.log('Expulsion created successfully!');
      return expulsionCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Expulsion[]> {
    try {
      const expulsionsFound = await this.expulsionModel.aggregate([
        ...expulsionQuery,
      ]);
      console.log('Expulsions found successfully');
      return expulsionsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: string) {
    throw new NotFoundException();
  }

  update(id: string, updateExpulsionDto: UpdateExpulsionDto) {
    throw new NotFoundException();
  }

  remove(id: string) {
    throw new NotFoundException();
  }
}

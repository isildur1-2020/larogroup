import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';
import { Reason, ReasonDocument } from './entities/reason.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ReasonService {
  constructor(
    @InjectModel(Reason.name)
    private reasonModel: Model<ReasonDocument>,
  ) {}

  async create(createReasonDto: CreateReasonDto): Promise<Reason> {
    try {
      const newReason = new this.reasonModel(createReasonDto);
      const reasonCreated = await newReason.save();
      console.log('Reason created successfully');
      return reasonCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Reason[]> {
    try {
      const reasonsFound = await this.reasonModel.find();
      console.log('Reasons found successfully');
      return reasonsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.reasonModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Reason with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateReasonDto: UpdateReasonDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.reasonModel.findByIdAndDelete(id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

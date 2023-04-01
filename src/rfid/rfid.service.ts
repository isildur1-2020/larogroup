import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRfidDto } from './dto/create-rfid.dto';
import { UpdateRfidDto } from './dto/update-rfid.dto';
import { Rfid, RfidDocument } from './entities/rfid.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { employeeQuery } from 'src/employee/queries/employeeQuery';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Employee } from 'src/employee/entities/employee.entity';

@Injectable()
export class RfidService {
  constructor(
    @InjectModel(Rfid.name)
    private rfidModel: Model<RfidDocument>,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
  ) {}

  async create(createRfidDto: CreateRfidDto): Promise<Rfid> {
    try {
      const { employee } = createRfidDto;
      await this.employeeService.documentExists(employee);
      const rfidsFound = await this.findAll(employee);
      if (rfidsFound.length !== 0) {
        throw new BadRequestException('This user already have a rfid');
      }
      const newRfid = new this.rfidModel(createRfidDto);
      const rfidCreated = await newRfid.save();
      console.log('Rfid created successfully');
      return rfidCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(employee: string): Promise<Rfid[]> {
    try {
      const rfidsFound = await this.rfidModel
        .find({ employee })
        .populate('employee')
        .exec();
      console.log('Rfids found successfully');
      return rfidsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneByData(data: string): Promise<Employee> {
    try {
      const rfidFound = await this.rfidModel.aggregate([
        { $match: { data } },
        {
          $lookup: {
            from: 'employees',
            foreignField: '_id',
            localField: 'employee',
            as: 'employee',
            pipeline: [...employeeQuery],
          },
        },
        { $unwind: '$employee' },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      if (rfidFound.length === 0) {
        throw new BadRequestException(
          `User with rfid code ${data} does not found`,
        );
      }
      console.log('Rfid found successfully');
      return rfidFound?.[0]?.employee;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  update(id: number, updateRfidDto: UpdateRfidDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.rfidModel.findByIdAndDelete(id);
      console.log(`Rfid with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

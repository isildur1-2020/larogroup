import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRfidDto } from './dto/create-rfid.dto';
import { UpdateRfidDto } from './dto/update-rfid.dto';
import { Rfid, RfidDocument } from './entities/rfid.entity';
import { employeeQuery } from 'src/common/queries/employee';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RfidService {
  constructor(
    @InjectModel(Rfid.name)
    private rfidModel: mongoose.Model<RfidDocument>,
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

  async findAll(employee_id: string): Promise<Rfid[]> {
    try {
      const rfidsFound = await this.rfidModel.aggregate([
        {
          $match: {
            employee: new mongoose.Types.ObjectId(employee_id),
          },
        },
        ...employeeQuery,
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Rfids found successfully');
      return rfidsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.rfidModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Rfid with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneByData(data: string): Promise<Employee> {
    try {
      const rfidFound = await this.rfidModel.aggregate([
        { $match: { data } },
        ...employeeQuery,
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

  update(id: string, updateRfidDto: UpdateRfidDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      await this.rfidModel.findByIdAndDelete(id);
      console.log(`Rfid with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async deleteByEmployeeId(employee_id: string) {
    try {
      await this.rfidModel.findOneAndDelete({ employee: employee_id });
      console.log(
        `Rfid with employee_id ${employee_id} was deleted succesfully`,
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

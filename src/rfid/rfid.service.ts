import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRfidDto } from './dto/create-rfid.dto';
import { UpdateRfidDto } from './dto/update-rfid.dto';
import { Rfid, RfidDocument } from './entities/rfid.entity';
import { EmployeeService } from 'src/employee/employee.service';
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
    private rfidModel: Model<RfidDocument>,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
  ) {}

  async create(createRfidDto: CreateRfidDto): Promise<Rfid> {
    try {
      const { employee } = createRfidDto;
      await this.employeeService.documentExists(employee);
      const newRfid = new this.rfidModel(createRfidDto);
      const rfidCreated = await newRfid.save();
      console.log('Rfid created successfully');
      return rfidCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(employeeId: string): Promise<Rfid[]> {
    try {
      const rfidsFound = await this.rfidModel
        .find({ employee: employeeId })
        .populate('employee')
        .exec();
      console.log('Rfids found successfully');
      return rfidsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
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

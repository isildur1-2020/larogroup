import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { UpdateBarcodeDto } from './dto/update-barcode.dto';
import { employeeQuery } from 'src/common/queries/employee';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { Barcode, BarcodeDocument } from './entities/barcode.entity';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class BarcodeService {
  constructor(
    @InjectModel(Barcode.name)
    private barcodeModel: mongoose.Model<BarcodeDocument>,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
  ) {}

  async create(createBarcodeDto: CreateBarcodeDto): Promise<Barcode> {
    try {
      const { employee } = createBarcodeDto;
      await this.employeeService.documentExists(employee);
      const barcodesFound = await this.findAll(employee);
      if (barcodesFound.length !== 0) {
        throw new BadRequestException(
          'This user already have a barcode register',
        );
      }
      const newBarcode = new this.barcodeModel(createBarcodeDto);
      const barcodeCreated = await newBarcode.save();
      console.log('Barcode created successfully');
      return barcodeCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(employee_id: string): Promise<Barcode[]> {
    try {
      const barcodesFound = await this.barcodeModel.aggregate([
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
      console.log('Barcodes found successfully');
      return barcodesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneByData(data: string): Promise<Employee> {
    try {
      const barcodeFound = await this.barcodeModel.aggregate([
        { $match: { data } },
        ...employeeQuery,
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      if (barcodeFound.length === 0) {
        throw new BadRequestException('Not user existent with this barcode');
      }
      console.log('Barcode found succesfully');
      return barcodeFound?.[0]?.employee;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  update(id: string, updateBarcodeDto: UpdateBarcodeDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.barcodeModel.findByIdAndDelete(id);
      console.log(`Barcode with id ${id} was deleted succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async deleteByEmployeeId(employee_id: string) {
    try {
      await this.barcodeModel.findOneAndDelete({ employee: employee_id });
      console.log(
        `Barcode with employee_id ${employee_id} was deleted succesfully`,
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

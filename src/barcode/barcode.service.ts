import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { UpdateBarcodeDto } from './dto/update-barcode.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { Barcode, BarcodeDocument } from './entities/barcode.entity';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class BarcodeService {
  constructor(
    @InjectModel(Barcode.name)
    private barcodeModel: Model<BarcodeDocument>,
    @Inject(EmployeeService)
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

  async findAll(employee: string): Promise<Barcode[]> {
    try {
      const barcodesFound = await this.barcodeModel
        .find({ employee })
        .populate('employee', ['first_name', 'second_name', 'email', 'dni'])
        .exec();
      console.log('Barcodes found successfully');
      return barcodesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findByData(data: string): Promise<Barcode> {
    try {
      const barcodeFound = await this.barcodeModel.findOne({ data });
      console.log('Barcode found succesfully');
      return barcodeFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  update(id: number, updateBarcodeDto: UpdateBarcodeDto) {
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
}

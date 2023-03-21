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
      const newBarcode = new this.barcodeModel(createBarcodeDto);
      const barcodeCreated = await newBarcode.save();
      console.log('Barcode created successfully');
      return barcodeCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(employeeId: string): Promise<Barcode[]> {
    try {
      const barcodesFound = await this.barcodeModel
        .find({ employee: employeeId })
        .populate('employee')
        .exec();
      console.log('Barcodes found successfully');
      return barcodesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
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

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateFingerprintDto } from './dto/create-fingerprint.dto';
import { UpdateFingerprintDto } from './dto/update-fingerprint.dto';
import {
  Fingerprint,
  FingerprintDocument,
} from './entities/fingerprint.entity';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FingerprintService {
  constructor(
    @InjectModel(Fingerprint.name)
    private fingerprinModel: Model<FingerprintDocument>,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
  ) {}

  async create(
    createFingerprintDto: CreateFingerprintDto,
  ): Promise<Fingerprint> {
    try {
      const { employee } = createFingerprintDto;
      await this.employeeService.documentExists(employee);
      const newFingerprint = new this.fingerprinModel(createFingerprintDto);
      const fingerprintCreated = await newFingerprint.save();
      console.log('Fingerprint created successfully');
      return fingerprintCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(employeeId: string): Promise<Fingerprint[]> {
    try {
      const fingerprintsFound = await this.fingerprinModel
        .find({ employee: employeeId })
        .populate('employee')
        .exec();
      console.log('Fingerprints found successfully');
      return fingerprintsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateFingerprintDto: UpdateFingerprintDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.fingerprinModel.findByIdAndDelete(id);
      console.log(`Fingerprint with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

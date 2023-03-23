import * as fs from 'fs';
import { join } from 'path';
import { Model } from 'mongoose';
import { Response } from 'express';
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
    file: Express.Multer.File,
  ): Promise<Fingerprint> {
    try {
      if (!file) {
        throw new BadRequestException('The fingerprint file is required');
      }
      const { employee } = createFingerprintDto;
      const fingerprintsFound = await this.findAll(employee);
      console.log(fingerprintsFound, typeof fingerprintsFound);
      if (fingerprintsFound.length !== 0) {
        throw new BadRequestException('Fingerprint is already exists');
      }
      await this.employeeService.documentExists(employee);
      const newFingerprint = new this.fingerprinModel({
        employee,
        fingerprint: file.filename,
      });
      const fingerprintCreated = await newFingerprint.save();
      console.log('Fingerprint created successfully');
      return fingerprintCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(employeeId: string) {
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

  findOne(fingerprintImage: string, res: Response) {
    try {
      const fingerprintImagePath = join(
        __dirname,
        `../../static/fingerprints/${fingerprintImage}`,
      );
      const isExistsImage = fs.existsSync(fingerprintImagePath);
      if (!isExistsImage) {
        throw new BadRequestException('Image does not exists');
      }
      res.sendFile(fingerprintImagePath);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
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

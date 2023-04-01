import * as fs from 'fs';
import { join } from 'path';
import mongoose, { Model } from 'mongoose';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeService } from 'src/employee/employee.service';
import { employeeQuery } from 'src/employee/queries/employeeQuery';
import { CreateFingerprintDto } from './dto/create-fingerprint.dto';
import { UpdateFingerprintDto } from './dto/update-fingerprint.dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Fingerprint,
  FingerprintDocument,
} from './entities/fingerprint.entity';
import { DeviceService } from 'src/device/device.service';

@Injectable()
export class FingerprintService {
  constructor(
    @InjectModel(Fingerprint.name)
    private fingerprintModel: Model<FingerprintDocument>,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
    @Inject(DeviceService)
    private deviceService: DeviceService,
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
      await this.findOneToVerificate(employee);
      await this.employeeService.documentExists(employee);
      const newFingerprint = new this.fingerprintModel({
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

  async findAllBySnDevice(sn: string) {
    try {
      const deviceFound = await this.deviceService.findOneBySN(sn);
      const fingerprintsFound = await this.fingerprintModel.aggregate([
        {
          $lookup: {
            from: 'employees',
            localField: 'employee',
            foreignField: '_id',
            as: 'employee',
            pipeline: [...employeeQuery],
          },
        },
        { $unwind: '$employee' },
        {
          $match: {
            'employee.campus._id': deviceFound.campus,
          },
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Fingerprints found successfully');
      return fingerprintsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOneToVerificate(employee: string): Promise<void> {
    try {
      const isExists = await this.fingerprintModel.findOne({ employee });
      if (isExists !== null) {
        throw new BadRequestException('Fingerprint is already exists');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOneByName(fingerprintImage: string, res: Response) {
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
      await this.fingerprintModel.findByIdAndDelete(id);
      console.log(`Fingerprint with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

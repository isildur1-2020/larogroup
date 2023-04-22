import * as fs from 'fs';
import { join } from 'path';
import mongoose, { Model } from 'mongoose';
import { Response } from 'express';
import { filePath } from 'src/utils/filePath';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceService } from 'src/device/device.service';
import { EmployeeService } from 'src/employee/employee.service';
import { employeeQuery } from 'src/common/queries/employeeQuery';
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
import { AccessGroupService } from 'src/access_group/access_group.service';

@Injectable()
export class FingerprintService {
  tmpFingerprintPath: string;

  constructor(
    @InjectModel(Fingerprint.name)
    private fingerprintModel: Model<FingerprintDocument>,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(AccessGroupService)
    private accessGroupService: AccessGroupService,
  ) {}

  async create(
    createFingerprintDto: CreateFingerprintDto,
    file: Express.Multer.File,
  ): Promise<Fingerprint> {
    try {
      if (!file) {
        throw new BadRequestException('The fingerprint file is required');
      }
      const { filename } = file;
      const { employee } = createFingerprintDto;
      const { root, temporal, fingerprints } = filePath;
      // SET SAVED FINGERPRINT PATH
      this.tmpFingerprintPath = join(
        __dirname,
        '../../',
        `${root}${temporal}/${filename}`,
      );
      const fingerprintsPath = join(
        __dirname,
        '../../',
        `${root}${fingerprints}/${filename}`,
      );
      // VALIDATIONS
      await this.findTwoToVerificate(employee);
      await this.employeeService.documentExists(employee);
      fs.renameSync(this.tmpFingerprintPath, fingerprintsPath);
      // CREATE AND SAVE FINGERPRINT
      const newFingerprint = new this.fingerprintModel({
        employee,
        fingerprint: file.filename,
      });
      const fingerprintCreated = await newFingerprint.save();
      console.log('Fingerprint created successfully');
      return fingerprintCreated;
    } catch (err) {
      console.log(err);
      fs.unlinkSync(this.tmpFingerprintPath);
      throw new BadRequestException(err.message);
    }
  }

  async findAllBySnDevice(sn: string) {
    try {
      const deviceFound = await this.deviceService.findOneBySN(sn);
      const accessGroupFound = await this.accessGroupService.findByDevice(
        deviceFound._id.toString(),
      );
      if (accessGroupFound.length === 0) {
        throw new BadRequestException('Dispositivo aislado');
      }
      console.log(accessGroupFound[0]);
      const fingerprintsFound = await this.fingerprintModel.aggregate([
        {
          $lookup: {
            from: 'employees',
            localField: 'employee',
            foreignField: '_id',
            as: 'employee',
            pipeline: [
              ...employeeQuery,
              {
                $project: {
                  rfid: 0,
                  city: 0,
                  barcode: 0,
                  is_active: 0,
                  categories: 0,
                  contract_end_date: 0,
                  contract_start_date: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$employee' },
        // {
        //   $match: {
        //     'employee.access_group._id': accessGroupFound[0],
        //   },
        // },
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

  async findTwoToVerificate(employee: string): Promise<void> {
    try {
      const isExists = await this.fingerprintModel.find({ employee });
      if (isExists.length >= 2) {
        throw new BadRequestException(
          'Two fingerprints enrolled, contact an admin',
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async fingerprintCountByEmployee(
    employee: string,
  ): Promise<{ count: number }> {
    try {
      const isExists = await this.fingerprintModel.find({ employee });
      console.log('Fingerprints count by employee found successfully');
      return {
        count: isExists.length,
      };
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

  update(id: string, updateFingerprintDto: UpdateFingerprintDto) {
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

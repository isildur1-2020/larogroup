import * as hex2dec from 'hex2dec';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReasonService } from 'src/reason/reason.service';
import { DeviceService } from 'src/device/device.service';
import { BarcodeService } from 'src/barcode/barcode.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { AuthMethods } from 'src/authentication_method/enums/auth-methods.enum';
import { CreateAuthenticationRecordDto } from './dto/create-authentication_record.dto';
import { UpdateAuthenticationRecordDto } from './dto/update-authentication_record.dto';
import { AuthenticationMethodService } from '../authentication_method/authentication_method.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  AuthenticationRecord,
  AuthenticationRecordDocument,
} from './entities/authentication_record.entity';
import { RfidService } from 'src/rfid/rfid.service';

@Injectable()
export class AuthenticationRecordService {
  constructor(
    @InjectModel(AuthenticationRecord.name)
    private authenticationRecordModel: mongoose.Model<AuthenticationRecordDocument>,
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(AuthenticationMethodService)
    private authenticationMethodService: AuthenticationMethodService,
    @Inject(ReasonService)
    private reasonService: ReasonService,
    @Inject(BarcodeService)
    private barcodeService: BarcodeService,
    @Inject(RfidService)
    private rfidService: RfidService,
  ) {}

  async create(
    createAuthenticationRecordDto: CreateAuthenticationRecordDto,
  ): Promise<Employee> {
    try {
      let userFound: Employee = null;
      const { data, sn, reason, authentication_method } =
        createAuthenticationRecordDto;
      const deviceFound = await this.deviceService.findOneBySN(sn);
      await this.authenticationMethodService.documentExists(
        authentication_method,
      );
      await this.reasonService.documentExists(reason);

      switch (authentication_method) {
        case AuthMethods.barcode:
          userFound = await this.barcodeService.findOneByData(data);
          break;
        case AuthMethods.nfc:
          const hexReversed = `${data?.[6]}${data?.[7]}${data?.[4]}${data?.[5]}${data?.[2]}${data?.[3]}${data?.[0]}${data?.[1]}`;
          const decimalData = hex2dec.hexToDec(hexReversed);
          userFound = await this.rfidService.findOneByData(decimalData);
          break;
        case AuthMethods.fingerprint:
          break;
      }
      const newAuthenticationRecord = new this.authenticationRecordModel({
        employee: userFound._id.toString(),
        device: deviceFound._id.toString(),
        ...createAuthenticationRecordDto,
      });
      await newAuthenticationRecord.save();
      console.log('Authentication record created successfully');
      return userFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<AuthenticationRecord[]> {
    try {
      const authenticationRecordsFound = await this.authenticationRecordModel
        .find()
        .populate('employee')
        .populate('device')
        .populate('authentication_method')
        .populate('reason')
        .exec();
      console.log('Authentication records found successfully');
      return authenticationRecordsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(
    id: number,
    updateAuthenticationRecordDto: UpdateAuthenticationRecordDto,
  ) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.authenticationRecordModel.findByIdAndDelete(id);
      console.log(
        `Authentication record with id ${id} was deleted successfully`,
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReasonService } from 'src/reason/reason.service';
import { DeviceService } from 'src/device/device.service';
import { BarcodeService } from 'src/barcode/barcode.service';
import { EmployeeService } from 'src/employee/employee.service';
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

@Injectable()
export class AuthenticationRecordService {
  constructor(
    @InjectModel(AuthenticationRecord.name)
    private authenticationRecordModel: Model<AuthenticationRecordDocument>,
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(AuthenticationMethodService)
    private authenticationMethodService: AuthenticationMethodService,
    @Inject(ReasonService)
    private reasonService: ReasonService,
    @Inject(BarcodeService)
    private barcodeService: BarcodeService,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
  ) {}

  async create(
    createAuthenticationRecordDto: CreateAuthenticationRecordDto,
  ): Promise<Employee> {
    try {
      let employee: string = null;
      const { data, device, reason, authentication_method } =
        createAuthenticationRecordDto;
      await this.deviceService.documentExists(device);
      await this.authenticationMethodService.documentExists(
        authentication_method,
      );
      await this.reasonService.documentExists(reason);

      if (authentication_method === AuthMethods.barcode) {
        const userFound = await this.barcodeService.findByData(data);
        if (userFound === null) {
          throw new BadRequestException('Not user existent with this barcode');
        }
        employee = userFound.employee;
      }
      const userFound = await this.employeeService.findOne(employee);
      const newAuthenticationRecord = new this.authenticationRecordModel({
        employee,
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

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReasonService } from 'src/reason/reason.service';
import { DeviceService } from 'src/device/device.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import { CreateAuthenticationRecordDto } from './dto/create-authentication_record.dto';
import { UpdateAuthenticationRecordDto } from './dto/update-authentication_record.dto';
import { AuthenticationMethodService } from '../authentication_method/authentication_method.service';
import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
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
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
    @Inject(CoordinatorService)
    private coordinatorService: CoordinatorService,
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(AuthenticationMethodService)
    private authenticationMethodService: AuthenticationMethodService,
    @Inject(ReasonService)
    private reasonService: ReasonService,
  ) {}

  async create(
    createAuthenticationRecordDto: CreateAuthenticationRecordDto,
  ): Promise<AuthenticationRecord> {
    try {
      const { employee, coordinator, device, authentication_method, reason } =
        createAuthenticationRecordDto;
      await this.employeeService.documentExists(employee);
      await this.coordinatorService.documentExists(coordinator);
      await this.deviceService.documentExists(device);
      await this.authenticationMethodService.documentExists(
        authentication_method,
      );
      await this.reasonService.documentExists(reason);
      const newAuthenticationRecord = new this.authenticationRecordModel(
        createAuthenticationRecordDto,
      );
      const authenticationRecordCreated = await newAuthenticationRecord.save();
      console.log('Authentication record created successfully');
      return authenticationRecordCreated;
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
        .populate('coordinator')
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

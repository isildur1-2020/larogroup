import * as hex2dec from 'hex2dec';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceService } from 'src/device/device.service';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { DirectionService } from 'src/direction/direction.service';
import { authRecordQuery } from 'src/common/queries/authRecordQuery';
import { AuthMethods } from 'src/authentication_method/enums/auth-methods.enum';
import { CreateAuthenticationRecordDto } from './dto/create-authentication_record.dto';
import { AuthenticationMethodService } from '../authentication_method/authentication_method.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthenticationRecord,
  AuthenticationRecordDocument,
} from './entities/authentication_record.entity';

@Injectable()
export class AuthenticationRecordService {
  constructor(
    @InjectModel(AuthenticationRecord.name)
    private authenticationRecordModel: mongoose.Model<AuthenticationRecordDocument>,
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(AuthenticationMethodService)
    private authenticationMethodService: AuthenticationMethodService,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
    @Inject(DirectionService)
    private directionService: DirectionService,
  ) {}

  async create(
    createAuthenticationRecordDto: CreateAuthenticationRecordDto,
  ): Promise<Employee> {
    try {
      let query = {};
      let userFound: Employee = null;
      const { data, sn, direction, auth_method, employee } =
        createAuthenticationRecordDto;

      const deviceFound = await this.deviceService.findOneBySN(sn);
      const authMethodFound =
        await this.authenticationMethodService.findOneByName(auth_method);
      const directionFound = await this.directionService.findOneByName(
        direction,
      );

      switch (auth_method) {
        case AuthMethods.barcode:
          query = { barcode: data };
          userFound = await this.employeeService.findOneByData(query);
          break;
        case AuthMethods.rfid:
          const hexReversed = `${data?.[6]}${data?.[7]}${data?.[4]}${data?.[5]}${data?.[2]}${data?.[3]}${data?.[0]}${data?.[1]}`;
          const decimalData = hex2dec.hexToDec(hexReversed);
          query = { rfid: decimalData };
          userFound = await this.employeeService.findOneByData(query);
          break;
        case AuthMethods.fingerprint:
          userFound = await this.employeeService.findOne(employee);
          break;
      }
      const newAuthenticationRecord = new this.authenticationRecordModel({
        ...createAuthenticationRecordDto,
        employee: userFound._id.toString(),
        device: deviceFound._id.toString(),
        authentication_method: authMethodFound._id.toString(),
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
      const authenticationRecordsFound =
        await this.authenticationRecordModel.aggregate([...authRecordQuery]);
      console.log('Authentication records found successfully');
      return authenticationRecordsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: string) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    throw new UnauthorizedException('This endpoint is forbidden');
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

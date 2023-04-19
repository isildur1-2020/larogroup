import * as hex2dec from 'hex2dec';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceService } from 'src/device/device.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
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
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

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
    @Inject(VehicleService)
    private vehicleService: VehicleService,
  ) {}

  async create(
    createAuthenticationRecordDto: CreateAuthenticationRecordDto,
  ): Promise<{
    type: string;
    message: string;
    vehicle: Vehicle | null;
    employee: Employee | null;
  }> {
    try {
      let vehicleFound: Vehicle = null;
      let employeeFound: Employee = null;
      const { data, sn, auth_method } = createAuthenticationRecordDto;

      const deviceFound = await this.deviceService.findOneBySN(sn);
      const authMethodFound =
        await this.authenticationMethodService.findOneByKey(auth_method);

      switch (auth_method) {
        case AuthMethods.barcode:
          vehicleFound = await this.vehicleService.findOneByBarcode(data);
          if (vehicleFound !== undefined) break;
          employeeFound = await this.employeeService.findOneByBarcode(data);
          if (!employeeFound) {
            throw new BadRequestException('CODIGO QR INEXISTENTE');
          }
          break;
        case AuthMethods.rfid:
          const hexReversed = `${data?.[6]}${data?.[7]}${data?.[4]}${data?.[5]}${data?.[2]}${data?.[3]}${data?.[0]}${data?.[1]}`;
          const decimalData = hex2dec.hexToDec(hexReversed);
          employeeFound = await this.employeeService.findOneByRfid(decimalData);
          if (!employeeFound) {
            throw new BadRequestException('TARJETA RFID INEXISTENTE');
          }
          break;
        case AuthMethods.fingerprint:
          employeeFound = await this.employeeService.findOne(data);
          break;
      }
      // VERIFY IS_ACTIVE
      // if (!Boolean(entityFound.is_active)) {
      //   throw new BadRequestException({
      //     entity: entityFound,
      //     role: roleFound.name,
      //     message: 'Usuario inactivo',
      //   });
      // }

      const newAuthenticationRecord = new this.authenticationRecordModel({
        ...createAuthenticationRecordDto,
        device: deviceFound._id.toString(),
        vehicle: vehicleFound?._id?.toString() ?? null,
        employee: employeeFound?._id?.toString() ?? null,
        authentication_method: authMethodFound._id.toString(),
      });
      await newAuthenticationRecord.save();
      console.log('Authentication record created successfully');
      return {
        vehicle: vehicleFound ?? null,
        employee: employeeFound ?? null,
        message: 'AUTENTICACIÓN EXITOSA',
        type: vehicleFound ? ValidRoles.vehicle : ValidRoles.employee,
      };
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

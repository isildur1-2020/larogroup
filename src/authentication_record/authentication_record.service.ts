import * as hex2dec from 'hex2dec';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoleService } from 'src/role/role.service';
import { DeviceService } from 'src/device/device.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
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
    @Inject(DirectionService)
    private directionService: DirectionService,
    @Inject(VehicleService)
    private vehicleService: VehicleService,
    @Inject(RoleService)
    private roleService: RoleService,
  ) {}

  async create(
    createAuthenticationRecordDto: CreateAuthenticationRecordDto,
  ): Promise<{
    role: string;
    message: string;
    entity: Employee | Vehicle;
  }> {
    try {
      let entityFound: Employee | Vehicle = null;
      const { data, sn, direction, auth_method } =
        createAuthenticationRecordDto;

      const deviceFound = await this.deviceService.findOneBySN(sn);
      const authMethodFound =
        await this.authenticationMethodService.findOneByKey(auth_method);
      const directionFound = await this.directionService.findOneByName(
        direction,
      );

      switch (auth_method) {
        case AuthMethods.barcode:
          entityFound = await this.vehicleService.findOneByBarcode(data);
          if (entityFound !== null) break;
          entityFound = await this.employeeService.findOneByBarcode(data);
          if (entityFound === null) {
            throw new BadRequestException(
              'No existe una entidad con esta información',
            );
          }
          break;
        case AuthMethods.rfid:
          const hexReversed = `${data?.[6]}${data?.[7]}${data?.[4]}${data?.[5]}${data?.[2]}${data?.[3]}${data?.[0]}${data?.[1]}`;
          const decimalData = hex2dec.hexToDec(hexReversed);
          entityFound = await this.employeeService.findOneByRfid(decimalData);
          break;
        case AuthMethods.fingerprint:
          entityFound = await this.employeeService.findOne(data);
          break;
      }
      const roleFound = await this.roleService.findOne(entityFound.role._id);
      // VERIFY IS_ACTIVE
      if (!Boolean(entityFound.is_active)) {
        throw new BadRequestException({
          entity: entityFound,
          role: roleFound.name,
          message: 'Usuario inactivo',
        });
      }

      const newAuthenticationRecord = new this.authenticationRecordModel({
        ...createAuthenticationRecordDto,
        entity: entityFound._id.toString(),
        device: deviceFound._id.toString(),
        direction: directionFound._id.toString(),
        authentication_method: authMethodFound._id.toString(),
      });
      await newAuthenticationRecord.save();
      console.log('Authentication record created successfully');
      return {
        role: roleFound.name,
        entity: entityFound,
        message: 'Autorizado exitosamente',
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

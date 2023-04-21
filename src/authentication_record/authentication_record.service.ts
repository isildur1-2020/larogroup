import * as moment from 'moment';
import * as hex2dec from 'hex2dec';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Entity } from './interfaces/entity.interface';
import { DeviceService } from 'src/device/device.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { authRecordQuery } from 'src/common/queries/authRecordQuery';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { AccessGroupService } from 'src/access_group/access_group.service';
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
import { deviceQuery } from 'src/common/queries/deviceQuery';
import { directionQuery } from 'src/common/queries/directionQuery';

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
    @Inject(AccessGroupService)
    private accessGroupService: AccessGroupService,
  ) {}

  async create(
    createAuthenticationRecordDto: CreateAuthenticationRecordDto,
  ): Promise<{
    message: string;
    vehicle: Vehicle | null;
    employee: Employee | null;
  }> {
    try {
      let entity: Entity;
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
            throw new BadRequestException('Código QR NO existe');
          }
          break;
        case AuthMethods.rfid:
          const hexReversed = `${data?.[6]}${data?.[7]}${data?.[4]}${data?.[5]}${data?.[2]}${data?.[3]}${data?.[0]}${data?.[1]}`;
          const decimalData = hex2dec.hexToDec(hexReversed);
          employeeFound = await this.employeeService.findOneByRfid(decimalData);
          if (!employeeFound) {
            throw new BadRequestException('Tarjeta RFID NO existe');
          }
          break;
        case AuthMethods.fingerprint:
          employeeFound = await this.employeeService.findOne(data);
          break;
      }
      // VERIFY IS_ACTIVE
      entity = vehicleFound ? vehicleFound : employeeFound;
      if (!Boolean(entity.is_active)) {
        return {
          vehicle: vehicleFound ?? null,
          employee: employeeFound ?? null,
          message: 'ENTIDAD INACTIVA',
        };
      }
      // VERIFY CONTRACT_END_DATE
      const isInactiveByContract = moment().isAfter(entity.contract_end_date);
      if (isInactiveByContract) {
        return {
          vehicle: vehicleFound ?? null,
          employee: employeeFound ?? null,
          message: 'ENTIDAD BLOQUEADA POR CONTRATO',
        };
      }
      // VERIFY ACCESS_GROUP
      const deviceId = deviceFound._id.toString();
      const groupsFound = await this.accessGroupService.findByDevice(deviceId);
      if (groupsFound.length === 0) {
        return {
          vehicle: vehicleFound ?? null,
          employee: employeeFound ?? null,
          message: 'DISPOSITIVO COLGANTE',
        };
      }
      const authorizedGroup = groupsFound[0]._id.toString();
      const userGroups = entity.access_group.map((el) => el._id.toString());
      const isUserAuthorized = userGroups.some(
        (_id) => _id === authorizedGroup,
      );
      if (!isUserAuthorized) {
        return {
          vehicle: vehicleFound ?? null,
          employee: employeeFound ?? null,
          message: 'ENTIDAD BLOQUEADA POR GRUPO DE ACCESO',
        };
      }
      // VERIFY ANTI_PASSBACK
      const devicesCount = await this.accessGroupService.findDevicesCountById(
        authorizedGroup,
      );
      if (devicesCount > 1) {
        const recordFound = await this.findByEntityIdAndAccessGroup(
          vehicleFound._id.toString(),
          authorizedGroup,
        );
        if (recordFound !== null) {
          const lastDeviceDirectionSaved = recordFound.device.direction.name;
          const currentDeviceDirection = deviceFound.direction.name;
          if (lastDeviceDirectionSaved === currentDeviceDirection) {
            return {
              vehicle: vehicleFound ?? null,
              employee: employeeFound ?? null,
              message: 'BLOQUEADO POR ANTIPASSBACK',
            };
          }
        }
      }

      const newAuthenticationRecord = new this.authenticationRecordModel({
        ...createAuthenticationRecordDto,
        access_group: authorizedGroup,
        device: deviceFound._id.toString(),
        vehicle: vehicleFound?._id?.toString() ?? null,
        employee: employeeFound?._id?.toString() ?? null,
        authentication_method: authMethodFound._id.toString(),
        entity: vehicleFound ? ValidRoles.vehicle : ValidRoles.employee,
        entity_id: vehicleFound
          ? vehicleFound._id.toString()
          : employeeFound._id.toString(),
      });
      await newAuthenticationRecord.save();
      console.log('Authentication record created successfully');
      return {
        vehicle: vehicleFound ?? null,
        employee: employeeFound ?? null,
        message: 'AUTENTICACIÓN EXITOSA',
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

  async findByEntityIdAndAccessGroup(
    entity_id: string,
    access_group: string,
  ): Promise<AuthenticationRecord> {
    try {
      const dataFound = await this.authenticationRecordModel.aggregate([
        {
          $match: {
            entity_id: new mongoose.Types.ObjectId(entity_id),
            access_group: new mongoose.Types.ObjectId(access_group),
          },
        },
        {
          $lookup: {
            from: 'devices',
            localField: 'device',
            foreignField: '_id',
            as: 'device',
            pipeline: [...directionQuery],
          },
        },
        { $unwind: '$device' },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
      return dataFound?.[0] ?? null;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
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

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
import { directionQuery } from 'src/common/queries/directionQuery';
import { authRecordQuery } from 'src/common/queries/authRecordQuery';
import { AttendanceService } from 'src/attendance/attendance.service';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { AccessGroupService } from 'src/access_group/access_group.service';
import { AuthMethods } from 'src/authentication_method/enums/auth-methods.enum';
import { CreateAuthenticationRecordDto } from './dto/create-authentication_record.dto';
import { AuthenticationMethodService } from '../authentication_method/authentication_method.service';
import {
  Inject,
  Injectable,
  forwardRef,
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
    @Inject(forwardRef(() => DeviceService))
    private deviceService: DeviceService,
    @Inject(forwardRef(() => AuthenticationMethodService))
    private authenticationMethodService: AuthenticationMethodService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
    @Inject(forwardRef(() => AccessGroupService))
    private accessGroupService: AccessGroupService,
    @Inject(AttendanceService)
    private attendanceService: AttendanceService,
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
          message: 'INACTIVO',
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
          message: 'DISPOSITIVO AISLADO',
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
        let recordFound = null;
        if (vehicleFound) {
          recordFound = await this.findByEntityIdAndAccessGroup(
            vehicleFound._id.toString(),
            authorizedGroup,
          );
        } else {
          recordFound = await this.findByEntityIdAndAccessGroup(
            employeeFound._id.toString(),
            authorizedGroup,
          );
        }
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
      // SAVE ATTENDANCE
      const { check_attendance, uncheck_attendance } = deviceFound;
      if (check_attendance && uncheck_attendance) {
        return {
          vehicle: vehicleFound ?? null,
          employee: employeeFound ?? null,
          message: 'BIDIRECTIONAL ATTENDANCE DEVICE',
        };
      }
      const attendanceData = {
        device: deviceFound,
        vehicle: vehicleFound,
        employee: employeeFound,
        entity: vehicleFound ? ValidRoles.vehicle : ValidRoles.employee,
      };
      if (check_attendance) {
        const attendanceFound = await this.attendanceService.findOne(
          attendanceData,
        );
        if (attendanceFound !== null) {
          return {
            vehicle: vehicleFound ?? null,
            employee: employeeFound ?? null,
            message: 'DOUBLE ATTENDANCE',
          };
        }
        await this.attendanceService.create(attendanceData);
      } else if (uncheck_attendance) {
        await this.attendanceService.remove(attendanceData);
      }

      // SAVE AUTHORIZE RECORD
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

  async validateByAuthMethod(authentication_method: string): Promise<void> {
    try {
      const authRecordsFound = await this.authenticationRecordModel.find({
        authentication_method,
      });
      if (authRecordsFound.length > 0) {
        throw new BadRequestException(
          'There are associated authorization records',
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByAccessGroup(access_group: string): Promise<void> {
    try {
      const authRecordsFound = await this.authenticationRecordModel.find({
        access_group,
      });
      if (authRecordsFound.length > 0) {
        throw new BadRequestException(
          'There are associated authorization records',
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByDevice(device: string): Promise<void> {
    try {
      const authRecordsFound = await this.authenticationRecordModel.find({
        device,
      });
      if (authRecordsFound.length > 0) {
        throw new BadRequestException(
          'There are associated authorization records',
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByEmployee(employee: string): Promise<void> {
    try {
      const authRecordsFound = await this.authenticationRecordModel.find({
        employee,
      });
      if (authRecordsFound.length > 0) {
        throw new BadRequestException(
          'There are associated authorization records',
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByVehicle(vehicle: string): Promise<void> {
    try {
      const authRecordsFound = await this.authenticationRecordModel.find({
        vehicle,
      });
      if (authRecordsFound.length > 0) {
        throw new BadRequestException(
          'There are associated authorization records',
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

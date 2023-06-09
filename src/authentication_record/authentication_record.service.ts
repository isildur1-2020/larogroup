import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { CustomRequest } from './interfaces/authRecord.interface';
import { directionQuery } from 'src/common/queries/directionQuery';
import { authRecordQuery } from 'src/common/queries/authRecordQuery';
import { AttendanceService } from 'src/attendance/attendance.service';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
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
    @Inject(forwardRef(() => AuthenticationMethodService))
    private authenticationMethodService: AuthenticationMethodService,
    @Inject(AttendanceService)
    private attendanceService: AttendanceService,
  ) {}

  async create(
    req: CustomRequest,
    createAuthenticationRecordDto: CreateAuthenticationRecordDto,
  ): Promise<{
    code: string;
    message: string;
    vehicle: Vehicle | null;
    employee: Employee | null;
  }> {
    try {
      const vehicleFound = req.vehicleFound;
      const employeeFound = req.employeeFound;
      // SAVE ATTENDANCE
      const { check_attendance, uncheck_attendance } = req.deviceFound;
      const attendanceData = {
        device: req.deviceFound,
        vehicle: vehicleFound,
        employee: employeeFound,
        entity: req.entityName,
      };
      if (check_attendance) {
        const attendanceFound = await this.attendanceService.findOne(
          attendanceData,
        );
        if (attendanceFound === null) {
          await this.attendanceService.create(attendanceData);
        }
      } else if (uncheck_attendance) {
        await this.attendanceService.remove(attendanceData);
      }

      // SAVE AUTHORIZE RECORD
      const newAuthenticationRecord = new this.authenticationRecordModel({
        ...createAuthenticationRecordDto,
        entity: req.entityName,
        access_group: req.authorizedGroup,
        entity_id: req.entity._id.toString(),
        device: req.deviceFound._id.toString(),
        vehicle: vehicleFound?._id?.toString() ?? null,
        employee: employeeFound?._id?.toString() ?? null,
        authentication_method: req.authMethodFound,
      });
      await newAuthenticationRecord.save();
      console.log('Authentication record created successfully');
      return {
        code: '100',
        vehicle: vehicleFound ?? null,
        employee: employeeFound ?? null,
        message: 'AUTENTICACIÓN EXITOSA',
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(
    start_date: string,
    end_date: string,
  ): Promise<AuthenticationRecord[]> {
    try {
      const dateFilter = {
        createdAt: {
          $gte: new Date(start_date),
          $lte: new Date(end_date),
        },
      };
      const authenticationRecordsFound =
        await this.authenticationRecordModel.aggregate([
          { $match: dateFilter },
          ...authRecordQuery,
          { $sort: { createdAt: -1 } },
        ]);
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

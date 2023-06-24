import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { CustomRequest } from './interfaces/authRecord.interface';
import { authRecordQuery } from 'src/common/queries/authRecordQuery';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { CreateAuthenticationRecordDto } from './dto/create-authentication_record.dto';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  forwardRef,
  Inject,
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
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
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
      if (!req.internalError) {
        req.internalAuthFlowBody = {
          code: '100',
          message: 'AUTENTICACIÓN EXITOSA',
        };
        const { entityName, entityId } = req;
        const currDate = moment().utc().toString();
        entityName === ValidRoles.employee
          ? await this.employeeService.updateLastActivity(entityId, currDate)
          : await this.vehicleService.updateLastActivity(entityId, currDate);
      }
      const newAuthenticationRecord = new this.authenticationRecordModel({
        ...createAuthenticationRecordDto,
        entity: req.entityName,
        device: req.deviceFoundId,
        zone: req.currentEntityZone,
        code: req.internalAuthFlowBody.code,
        message: req.internalAuthFlowBody.message,
        authentication_method: req.authMethodFound,
        vehicle: req.vehicleFound?._id?.toString() ?? null,
        employee: req.employeeFound?._id?.toString() ?? null,
      });
      await newAuthenticationRecord.save();
      console.log('Authentication record created successfully');
      return {
        ...req.internalAuthFlowBody,
        vehicle: req.vehicleFound ?? null,
        employee: req.employeeFound ?? null,
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

  async remove(id: string): Promise<void> {
    throw new UnauthorizedException('This endpoint is forbidden');
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

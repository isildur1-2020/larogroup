import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { attendanceQuery } from './queries/attendance.query';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ExpulsionService } from 'src/expulsion/expulsion.service';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { CurrentUser } from 'src/auth/interfaces/jwt-payload.interface';
import { Attendance, AttendanceDocument } from './entities/attendance.entity';
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
    @Inject(ExpulsionService)
    private expulsionService: ExpulsionService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(forwardRef(() => VehicleService))
    private vehicleService: VehicleService,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    try {
      const newAttendance = new this.attendanceModel(createAttendanceDto);
      const attendanceCreated = await newAttendance.save();
      console.log('Attendance created successfully');
      return attendanceCreated;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOneByEmployee(employee: string): Promise<Attendance> {
    try {
      const attendanceFound = await this.attendanceModel.findOne({ employee });
      console.log('Attendance by employee found successfully');
      return attendanceFound;
    } catch (err) {
      console.log(err);
    }
  }

  async findOneByVehicle(vehicle: string): Promise<Attendance> {
    try {
      const attendanceFound = await this.attendanceModel.findOne({ vehicle });
      console.log('Attendance by vehicle found successfully');
      return attendanceFound;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(): Promise<Attendance[]> {
    try {
      const attendanceFound = await this.attendanceModel.aggregate([
        ...attendanceQuery,
      ]);
      console.log('Attendance found successfully');
      return attendanceFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.attendanceModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(
          `Attendance with id ${id} does not exists`,
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findOne(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    try {
      let attendanceFound: Attendance = null;
      const { entity, employee, vehicle } = createAttendanceDto;
      if (entity === ValidRoles.employee) {
        const employeeId = employee._id.toString();
        attendanceFound = await this.findOneByEmployee(employeeId);
      } else if (entity === ValidRoles.vehicle) {
        const vehicleId = vehicle._id.toString();
        attendanceFound = await this.findOneByVehicle(vehicleId);
      }
      return attendanceFound;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async remove(createAttendanceDto: CreateAttendanceDto): Promise<void> {
    try {
      const attendanceFound = await this.findOne(createAttendanceDto);
      if (attendanceFound !== null) {
        const attendanceId = attendanceFound._id.toString();
        await this.attendanceModel.findByIdAndDelete(attendanceId);
      }
      console.log('Attendance was deleted successfully');
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async deleteOne(id: string, currentUser: CurrentUser): Promise<void> {
    try {
      await this.documentExists(id);
      const attendanceFound = await this.attendanceModel.findById(id);
      const { entity, employee, vehicle } = attendanceFound;
      entity === ValidRoles.employee
        ? await this.employeeService.updateCurrentZone(
            employee?._id?.toString(),
            null,
          )
        : await this.vehicleService.updateCurrentZone(
            vehicle?._id?.toString(),
            null,
          );
      await this.expulsionService.create({
        entity,
        employee,
        vehicle,
        username: currentUser.username,
      });
      await this.attendanceModel.findByIdAndDelete(id);
      console.log('Attendance was deleted successfully!');
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }
}

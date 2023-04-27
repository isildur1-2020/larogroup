import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { Attendance, AttendanceDocument } from './entities/attendance.entity';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
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

  async findAll(): Promise<Attendance[]> {
    try {
      const attendanceFound = await this.attendanceModel.find();
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
        attendanceFound = await this.findOneByEmployee(vehicleId);
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
        await this.documentExists(attendanceId);
        await this.attendanceModel.findByIdAndDelete(attendanceId);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

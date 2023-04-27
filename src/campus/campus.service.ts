import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCampusDto } from './dto/create-campus.dto';
import { DeviceService } from 'src/device/device.service';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { Campus, CampusDocument } from './entities/campus.entity';
import { subcompanyQuery } from 'src/common/queries/subcompanyQuery';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CampusService {
  constructor(
    @InjectModel(Campus.name)
    private campusModel: Model<CampusDocument>,
    @Inject(forwardRef(() => SubCompanyService))
    private subCompanyService: SubCompanyService,
    @Inject(CoordinatorService)
    private coordinatorService: CoordinatorService,
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
  ) {}

  async create(createCampusDto: CreateCampusDto): Promise<Campus> {
    try {
      const { sub_company } = createCampusDto;
      await this.subCompanyService.documentExists(sub_company);
      const newCampus = new this.campusModel(createCampusDto);
      const campusCreated = newCampus.save();
      console.log('Campus created successfully');
      return campusCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Campus[]> {
    try {
      const campusFound = await this.campusModel.aggregate([
        ...subcompanyQuery,
        {
          $project: {
            updatedAt: 0,
          },
        },
      ]);
      console.log('Headquarters found successfully');
      return campusFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.campusModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Campus with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  async update(id: string, updateCampusDto: UpdateCampusDto): Promise<void> {
    try {
      await this.documentExists(id);
      await this.campusModel.findByIdAndUpdate(id, updateCampusDto);
      console.log(`Campus with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      // RESTRICT DELETE
      await this.employeeService.validateByCampus(id);
      await this.deviceService.validateByCampus(id);
      await this.coordinatorService.validateByCampus(id);
      await this.campusModel.findByIdAndDelete(id);
      console.log(`Campus with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateBySubCompany(sub_company: string): Promise<void> {
    try {
      const campusFound = await this.campusModel.find({ sub_company });
      if (campusFound.length > 0) {
        throw new BadRequestException('There are associated campus');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

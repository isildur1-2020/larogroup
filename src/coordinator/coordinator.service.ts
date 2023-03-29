import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CampusService } from 'src/campus/campus.service';
import { employeeQuery } from 'src/common/querys/employee';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Coordinator,
  CoordinatorDocument,
} from './entities/coordinator.entity';

@Injectable()
export class CoordinatorService {
  constructor(
    @InjectModel(Coordinator.name)
    private coordinatorModel: mongoose.Model<CoordinatorDocument>,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
    @Inject(SubCompanyService)
    private subCompanyService: SubCompanyService,
    @Inject(CampusService)
    private campusService: CampusService,
  ) {}

  async create(createCoordinatorDto: CreateCoordinatorDto): Promise<void> {
    throw new InternalServerErrorException('This endpoint is forbidden!');
    try {
      const { employee, sub_company, campus, password } = createCoordinatorDto;
      await this.employeeService.documentExists(employee);
      await this.subCompanyService.documentExists(sub_company);
      await this.campusService.documentExists(campus);
      const newCoordinator = new this.coordinatorModel(createCoordinatorDto);
      newCoordinator.password = bcrypt.hashSync(password, 10);
      await newCoordinator.save();
      console.log('Coordinator created successfully');
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Coordinator[]> {
    try {
      const coordinatorsFound = await this.coordinatorModel.aggregate([
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
        {
          $unwind: '$role',
        },
        ...employeeQuery,
        {
          $lookup: {
            from: 'subcompanies',
            localField: 'sub_company',
            foreignField: '_id',
            as: 'sub_company',
            pipeline: [
              {
                $lookup: {
                  from: 'companies',
                  localField: 'company',
                  foreignField: '_id',
                  as: 'company',
                  pipeline: [
                    {
                      $project: {
                        createdAt: 0,
                        updatedAt: 0,
                        city: 0,
                        country: 0,
                      },
                    },
                  ],
                },
              },
              { $unwind: '$company' },
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                  city: 0,
                  country: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$sub_company' },
        {
          $lookup: {
            from: 'campus',
            localField: 'campus',
            foreignField: '_id',
            as: 'campus',
            pipeline: [
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$campus' },
        {
          $project: {
            is_active: 0,
            password: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Coordinators found successfully');
      return coordinatorsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.coordinatorModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(
          `Coordinator with id ${id} does not exists`,
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  async update(
    id: string,
    updateCoordinatorDto: UpdateCoordinatorDto,
  ): Promise<void> {
    throw new InternalServerErrorException('This endpoint is forbidden!');
    try {
      await this.documentExists(id);
      await this.coordinatorModel.findByIdAndUpdate(id, updateCoordinatorDto);
      console.log(`Coordinator with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    throw new InternalServerErrorException('This endpoint is forbidden!');
    try {
      await this.documentExists(id);
      await this.coordinatorModel.findByIdAndDelete(id);
      console.log(`Coordinator with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

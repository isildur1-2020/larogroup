import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Coordinator,
  CoordinatorDocument,
} from './entities/coordinator.entity';

@Injectable()
export class CoordinatorService {
  constructor(
    @InjectModel(Coordinator.name)
    private coordinatorModel: Model<CoordinatorDocument>,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
  ) {}

  async create(
    createCoordinatorDto: CreateCoordinatorDto,
  ): Promise<Coordinator> {
    try {
      const { employee } = createCoordinatorDto;
      await this.employeeService.documentExists(employee);
      const newCoordinator = new this.coordinatorModel(createCoordinatorDto);
      const coordinatorSaved = await newCoordinator.save();
      console.log('Coordinator created successfully');
      return coordinatorSaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Coordinator[]> {
    try {
      const coordinatorsFound = await this.coordinatorModel
        .find()
        .populate('role')
        .populate('employee')
        .exec();
      console.log('Coordinators found successfully');
      return coordinatorsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateCoordinatorDto: UpdateCoordinatorDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.coordinatorModel.findByIdAndDelete(id);
      console.log(`Coordinator with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
    }
  }
}

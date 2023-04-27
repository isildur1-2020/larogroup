import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DniType } from './entities/dni_type.entity';
import { CreateDniTypeDto } from './dto/create-dni_type.dto';
import { UpdateDniTypeDto } from './dto/update-dni_type.dto';
import { EmployeeService } from 'src/employee/employee.service';
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class DniTypeService {
  constructor(
    @InjectModel(DniType.name)
    private dniTypeModel: Model<DniType>,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
  ) {}

  async create(createDniTypeDto: CreateDniTypeDto): Promise<DniType> {
    try {
      const newDniType = new this.dniTypeModel(createDniTypeDto);
      const dniTypeSaved = await newDniType.save();
      console.log('Dni_type saved successfully');
      return dniTypeSaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<DniType[]> {
    try {
      const dniTypesFound = await this.dniTypeModel.aggregate([
        {
          $project: {
            updatedAt: 0,
          },
        },
      ]);
      console.log('Dni types found successfully');
      return dniTypesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.dniTypeModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Dni type with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, updateDniTypeDto: UpdateDniTypeDto): Promise<void> {
    try {
      await this.documentExists(id);
      await this.dniTypeModel.findByIdAndUpdate(id, updateDniTypeDto);
      console.log(`Dni type with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      // RESTRICT DELETE
      await this.employeeService.validateByDniType(id);
      await this.dniTypeModel.findOneAndDelete({ _id: id });
      console.log(`Dni type with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

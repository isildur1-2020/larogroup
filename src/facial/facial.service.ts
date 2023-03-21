import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFacialDto } from './dto/create-facial.dto';
import { UpdateFacialDto } from './dto/update-facial.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { Facial, FacialDocument } from './entities/facial.entity';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FacialService {
  constructor(
    @InjectModel(Facial.name)
    private facialModel: Model<FacialDocument>,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
  ) {}

  async create(createFacialDto: CreateFacialDto): Promise<Facial> {
    try {
      const { employee } = createFacialDto;
      await this.employeeService.documentExists(employee);
      const newFacial = new this.facialModel(createFacialDto);
      const facialCreated = await newFacial.save();
      console.log('Facial created succesfully');
      return facialCreated;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(id: string): Promise<Facial[]> {
    try {
      const facialsFound = await this.facialModel
        .find({ employee: id })
        .populate('employee')
        .exec();
      console.log('Facials found successfully');
      if (facialsFound === null) {
        throw new BadRequestException(
          `This employee does not have any facials`,
        );
      }
      return facialsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateFacialDto: UpdateFacialDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.facialModel.findByIdAndDelete(id);
      console.log(`Facial with id ${id} was deleted succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

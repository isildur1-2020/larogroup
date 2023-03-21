import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyService } from 'src/company/company.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Administrator,
  AdministratorDocument,
} from './entities/administrator.entity';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectModel(Administrator.name)
    private administratorModel: Model<AdministratorDocument>,
    @Inject(CompanyService)
    private companyService: CompanyService,
  ) {}

  async create(
    createAdministratorDto: CreateAdministratorDto,
  ): Promise<Administrator> {
    try {
      const { company } = createAdministratorDto;
      await this.companyService.documentExists(company);
      const newAdministrator = new this.administratorModel(
        createAdministratorDto,
      );
      const administratorSaved = await newAdministrator.save();
      console.log('Administrator created succesfully');
      return administratorSaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Administrator[]> {
    try {
      const administratorsFound = await this.administratorModel
        .find()
        .populate('role')
        .populate('company');
      console.log('Administrator found successfully');
      return administratorsFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.administratorModel.findByIdAndDelete(id);
      console.log(`Administrator with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

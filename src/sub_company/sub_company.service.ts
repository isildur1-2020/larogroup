import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { City } from 'src/city/entities/city.entity';
import { Company } from 'src/company/entities/company.entity';
import { Country } from 'src/country/entities/country.entity';
import { CreateSubCompanyDto } from './dto/create-sub_company.dto';
import { UpdateSubCompanyDto } from './dto/update-sub_company.dto';
import { SubCompany, SubCompanyDocument } from './entities/sub_company.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class SubCompanyService {
  constructor(
    @InjectModel(SubCompany.name)
    private subCompanyModel: Model<SubCompanyDocument>,
  ) {}

  async create(createSubCompanyDto: CreateSubCompanyDto): Promise<SubCompany> {
    try {
      const newSubCompany = new this.subCompanyModel(createSubCompanyDto);
      const subCompanySaved = await newSubCompany.save();
      console.log('Sub company created successfully');
      return subCompanySaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<SubCompany[]> {
    try {
      const subCompaniesFound = await this.subCompanyModel
        .find()
        .populate('city')
        .populate('country')
        .populate('company')
        .exec();
      return subCompaniesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateSubCompanyDto: UpdateSubCompanyDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.subCompanyModel.findByIdAndDelete({ _id: id });
      console.log(`Sub company with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

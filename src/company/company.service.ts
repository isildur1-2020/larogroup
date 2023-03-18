import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { City } from 'src//city/entities/city.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Country } from 'src/country/entities/country.entity';
import { Company, CompanyDocument } from './entities/company.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const newCompany = new this.companyModel(createCompanyDto);
      const companySaved = await newCompany.save();
      console.log('Company saved successfully');
      return companySaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      const companiesFound = await this.companyModel
        .find()
        .populate('country', null, Country.name)
        .populate('city', null, City.name)
        .exec();
      console.log('Companies found successfully');
      return companiesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.companyModel.findByIdAndDelete({ _id: id });
      console.log(`Company with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

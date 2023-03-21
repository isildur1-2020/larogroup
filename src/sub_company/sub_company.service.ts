import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CityService } from 'src/city/city.service';
import { CountryService } from 'src/country/country.service';
import { CompanyService } from 'src/company/company.service';
import { CreateSubCompanyDto } from './dto/create-sub_company.dto';
import { UpdateSubCompanyDto } from './dto/update-sub_company.dto';
import { SubCompany, SubCompanyDocument } from './entities/sub_company.entity';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class SubCompanyService {
  constructor(
    @InjectModel(SubCompany.name)
    private subCompanyModel: Model<SubCompanyDocument>,
    @Inject(CityService)
    private cityService: CityService,
    @Inject(CountryService)
    private countryService: CountryService,
    @Inject(CompanyService)
    private companyService: CompanyService,
  ) {}

  async create(createSubCompanyDto: CreateSubCompanyDto): Promise<SubCompany> {
    try {
      const { city, country, company } = createSubCompanyDto;
      await this.cityService.documentExists(city);
      await this.countryService.documentExists(country);
      await this.companyService.documentExists(company);
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

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.subCompanyModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(
          `Subcompany with id ${id} does not exists`,
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

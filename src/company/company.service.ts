import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CityService } from 'src/city/city.service';
import { cityQuery } from 'src/common/queries/cityQuery';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './entities/company.entity';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import { AdministratorService } from 'src/administrator/administrator.service';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,
    @Inject(forwardRef(() => CityService))
    private cityService: CityService,
    @Inject(forwardRef(() => SubCompanyService))
    private subCompanyService: SubCompanyService,
    @Inject(forwardRef(() => AdministratorService))
    private administratorService: AdministratorService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const { city } = createCompanyDto;
      await this.cityService.documentExists(city);
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
      const companiesFound = await this.companyModel.aggregate([
        ...cityQuery,
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ]);
      console.log('Companies found successfully');
      return companiesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.companyModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Company with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: string) {
    throw new NotFoundException();
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      await this.documentExists(id);
      await this.companyModel.findByIdAndUpdate(id, updateCompanyDto);
      console.log(`Company with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      // RESTRICT DELETE
      await this.subCompanyService.validateByCompany(id);
      await this.administratorService.validateByCompany(id);
      await this.companyModel.findByIdAndDelete({ _id: id });
      console.log(`Company with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByCity(city: string): Promise<void> {
    try {
      const companiesFound = await this.companyModel.find({ city });
      if (companiesFound.length > 0) {
        throw new BadRequestException('There are associated companies');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

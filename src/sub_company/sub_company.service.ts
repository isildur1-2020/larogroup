import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CityService } from 'src/city/city.service';
import { cityQuery } from 'src/common/queries/cityQuery';
import { CompanyService } from 'src/company/company.service';
import { companyQuery } from 'src/common/queries/companyQuery';
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
    @Inject(CompanyService)
    private companyService: CompanyService,
  ) {}

  async create(createSubCompanyDto: CreateSubCompanyDto): Promise<SubCompany> {
    try {
      const { city, company } = createSubCompanyDto;
      await this.cityService.documentExists(city);
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
      const subCompaniesFound = await this.subCompanyModel.aggregate([
        ...cityQuery,
        ...companyQuery,
      ]);
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

  async update(
    id: string,
    updateSubCompanyDto: UpdateSubCompanyDto,
  ): Promise<void> {
    try {
      await this.documentExists(id);
      await this.subCompanyModel.findByIdAndUpdate(id, updateSubCompanyDto);
      console.log(`Subcompany with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      await this.subCompanyModel.findByIdAndDelete({ _id: id });
      console.log(`Sub company with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

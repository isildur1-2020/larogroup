import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CityService } from 'src/city/city.service';
import { cityQuery } from 'src/common/queries/cityQuery';
import { CampusService } from 'src/campus/campus.service';
import { CompanyService } from 'src/company/company.service';
import { companyQuery } from 'src/common/queries/companyQuery';
import { CategoryService } from 'src/category/category.service';
import { CreateSubCompanyDto } from './dto/create-sub_company.dto';
import { UpdateSubCompanyDto } from './dto/update-sub_company.dto';
import { AccessGroupService } from 'src/access_group/access_group.service';
import { SubCompany, SubCompanyDocument } from './entities/sub_company.entity';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class SubCompanyService {
  constructor(
    @InjectModel(SubCompany.name)
    private subCompanyModel: Model<SubCompanyDocument>,
    @Inject(forwardRef(() => CityService))
    private cityService: CityService,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
    @Inject(forwardRef(() => CampusService))
    private campusService: CampusService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    @Inject(forwardRef(() => AccessGroupService))
    private accessGroupService: AccessGroupService,
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
      // RESTRICT DELETE
      await this.accessGroupService.validateBySubCompany(id);
      await this.categoryService.validateBySubCompany(id);
      await this.campusService.validateBySubCompany(id);

      await this.subCompanyModel.findByIdAndDelete(id);
      console.log(`Sub company with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByCity(city: string): Promise<void> {
    try {
      const subCompaniesFound = await this.subCompanyModel.find({ city });
      if (subCompaniesFound.length > 0) {
        throw new BadRequestException('There are sub companies associated');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByCompany(company: string): Promise<void> {
    try {
      const subCompaniesFound = await this.subCompanyModel.find({ company });
      if (subCompaniesFound.length > 0) {
        throw new BadRequestException('There are sub companies associated');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

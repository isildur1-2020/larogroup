import { Model } from 'mongoose';
import { colCities } from './data';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City, CityDocument } from './entities/city.entity';
import { CountryService } from 'src/country/country.service';
import { CompanyService } from 'src/company/company.service';
import { countryQuery } from 'src/common/queries/countryQuery';
import { EmployeeService } from 'src/employee/employee.service';
import { SubCompanyService } from 'src/sub_company/sub_company.service';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name)
    private cityModel: Model<CityDocument>,
    @Inject(forwardRef(() => CountryService))
    private countryService: CountryService,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
    @Inject(forwardRef(() => SubCompanyService))
    private subCompanyService: SubCompanyService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<void> {
    try {
      const { country } = createCityDto;
      await this.countryService.documentExists(country);
      await this.cityModel.deleteMany();
      for (let city of colCities) {
        const cityData = {
          country,
          name: city,
        };
        const newCity = new this.cityModel(cityData);
        await newCity.save();
        console.log(`City ${city} was created successfully`);
      }
      console.log(`Cities of ${country} was created succesfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<City[]> {
    try {
      const citiesFound = await this.cityModel.aggregate([...countryQuery]);
      console.log('Cities found successfully');
      return citiesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.cityModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`City with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: string) {
    throw new NotFoundException();
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<void> {
    try {
      await this.documentExists(id);
      await this.cityModel.findByIdAndUpdate(id, updateCityDto);
      console.log(`City with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      // RESTRICT DELETE FOREIGN
      await this.employeeService.validateByCity(id);
      await this.companyService.validateByCity(id);
      await this.subCompanyService.validateByCity(id);
      await this.cityModel.findByIdAndDelete(id);
      console.log(`City with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async validateByCountry(country: string): Promise<void> {
    try {
      const citiesFound = await this.cityModel.find({ country });
      if (citiesFound.length > 0) {
        throw new BadRequestException('There are associated cities');
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

import { Model } from 'mongoose';
import { colCities } from './data';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City, CityDocument } from './entities/city.entity';
import { CountryService } from 'src/country/country.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { countryQuery } from 'src/common/queries/countryQuery';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name)
    private cityModel: Model<CityDocument>,
    @Inject(CountryService)
    private countryService: CountryService,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<void> {
    try {
      const { country } = createCityDto;
      await this.countryService.documentExists(country);
      await this.cityModel.deleteMany();
      const createCity = async (cityName: string) => {
        try {
          const cityData = {
            country,
            name: cityName,
          };
          const newCity = new this.cityModel(cityData);
          await newCity.save();
          console.log(`City ${cityName} was created successfully`);
        } catch (err) {
          console.log(err);
          throw new BadRequestException(err.message);
        }
      };
      colCities.map((cityName) => createCity(cityName));
      console.log('Cities of Colombia created succesfully');
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
      await this.cityModel.findByIdAndDelete(id);
      console.log(`City with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

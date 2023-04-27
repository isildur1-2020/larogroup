import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CityService } from 'src/city/city.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country, CountryDocument } from './entities/country.entity';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name)
    private countryModel: Model<CountryDocument>,
    @Inject(forwardRef(() => CityService))
    private cityService: CityService,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    try {
      const newCountry = new this.countryModel(createCountryDto);
      const countrySaved = await newCountry.save();
      console.log('Country created successfully');
      return countrySaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<Country[]> {
    try {
      const countriesFound = await this.countryModel.aggregate([
        {
          $project: {
            updatedAt: 0,
          },
        },
      ]);
      console.log('Countries found successfully');
      return countriesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async documentExists(id: string): Promise<void> {
    try {
      const isExists = await this.countryModel.exists({ _id: id });
      if (isExists === null) {
        throw new BadRequestException(`Country with id ${id} does not exists`);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: string) {
    throw new NotFoundException();
  }

  async update(id: string, updateCountryDto: UpdateCountryDto): Promise<void> {
    try {
      await this.documentExists(id);
      await this.countryModel.findByIdAndUpdate(id, updateCountryDto);
      console.log(`Country with id ${id} was updated successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentExists(id);
      // FORBIDDEN DELETE FOREIGN KEYS
      await this.cityService.validateByCountry(id);
      await this.countryModel.findByIdAndDelete(id);
      console.log(`Country with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

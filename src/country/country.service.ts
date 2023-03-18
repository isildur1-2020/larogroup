import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country, CountryDocument } from './entities/country.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name)
    private countryModel: Model<CountryDocument>,
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
      const countriesFound = await this.countryModel.find();
      console.log('Countries found successfully');
      return countriesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.countryModel.findByIdAndDelete({ _id: id });
      console.log(`Country with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

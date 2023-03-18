import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City, CityDocument } from './entities/city.entity';
import { Country } from '../country/entities/country.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name)
    private cityModel: Model<CityDocument>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    try {
      const newCity = new this.cityModel(createCityDto);
      const citySaved = await newCity.save();
      console.log('City created succesfully');
      return citySaved;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async findAll(): Promise<City[]> {
    try {
      const citiesFound = await this.cityModel
        .find()
        .populate('country', null, Country.name)
        .exec();
      console.log('Cities found successfully');
      return citiesFound;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  findOne(id: number) {
    throw new NotFoundException();
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    try {
      await this.cityModel.findByIdAndDelete({ _id: id });
      console.log(`City with id ${id} was deleted successfully`);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

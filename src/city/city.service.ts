import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City, CityDocument } from './entities/city.entity';
import { Country } from '../country/entities/country.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name)
    private cityModel: Model<CityDocument>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    await this.cityModel.create(createCityDto);
  }

  async findAll() {
    const x = await this.cityModel
      .find()
      .populate('country', null, Country.name)
      .exec();
    return x;
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}

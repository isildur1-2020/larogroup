import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Country, CountryDocument } from './entities/country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name)
    private catModel: Model<CountryDocument>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    await this.catModel.create(createCountryDto);
  }

  findAll() {
    return `This action returns all country`;
  }

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }
}

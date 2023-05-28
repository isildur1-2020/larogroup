import { Injectable } from '@nestjs/common';
import { CreateExpulsionDto } from './dto/create-expulsion.dto';
import { UpdateExpulsionDto } from './dto/update-expulsion.dto';

@Injectable()
export class ExpulsionService {
  create(createExpulsionDto: CreateExpulsionDto) {
    return 'This action adds a new expulsion';
  }

  findAll() {
    return `This action returns all expulsion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expulsion`;
  }

  update(id: number, updateExpulsionDto: UpdateExpulsionDto) {
    return `This action updates a #${id} expulsion`;
  }

  remove(id: number) {
    return `This action removes a #${id} expulsion`;
  }
}

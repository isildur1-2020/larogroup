import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpulsionService } from './expulsion.service';
import { CreateExpulsionDto } from './dto/create-expulsion.dto';
import { UpdateExpulsionDto } from './dto/update-expulsion.dto';

@Controller('expulsion')
export class ExpulsionController {
  constructor(private readonly expulsionService: ExpulsionService) {}

  @Post()
  create(@Body() createExpulsionDto: CreateExpulsionDto) {
    return this.expulsionService.create(createExpulsionDto);
  }

  @Get()
  findAll() {
    return this.expulsionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expulsionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpulsionDto: UpdateExpulsionDto) {
    return this.expulsionService.update(+id, updateExpulsionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expulsionService.remove(+id);
  }
}

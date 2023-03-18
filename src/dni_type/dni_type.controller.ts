import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { DniTypeService } from './dni_type.service';
import { CreateDniTypeDto } from './dto/create-dni_type.dto';
import { UpdateDniTypeDto } from './dto/update-dni_type.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('dni-type')
export class DniTypeController {
  constructor(private readonly dniTypeService: DniTypeService) {}

  @Post()
  create(@Body() createDniTypeDto: CreateDniTypeDto) {
    return this.dniTypeService.create(createDniTypeDto);
  }

  @Get()
  findAll() {
    return this.dniTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dniTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDniTypeDto: UpdateDniTypeDto) {
    return this.dniTypeService.update(+id, updateDniTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.dniTypeService.remove(id);
  }
}

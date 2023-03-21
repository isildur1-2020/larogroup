import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Post()
  create(@Body() createSuperadminDto: CreateSuperadminDto) {
    return this.superadminService.create(createSuperadminDto);
  }

  @Get()
  findAll() {
    return this.superadminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.superadminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateSuperadminDto: UpdateSuperadminDto,
  ) {
    return this.superadminService.update(id, updateSuperadminDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.superadminService.remove(id);
  }
}
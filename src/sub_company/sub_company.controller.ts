import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { SubCompanyService } from './sub_company.service';
import { CreateSubCompanyDto } from './dto/create-sub_company.dto';
import { UpdateSubCompanyDto } from './dto/update-sub_company.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('sub-company')
export class SubCompanyController {
  constructor(private readonly subCompanyService: SubCompanyService) {}

  @Post()
  create(@Body() createSubCompanyDto: CreateSubCompanyDto) {
    return this.subCompanyService.create(createSubCompanyDto);
  }

  @Get()
  findAll() {
    return this.subCompanyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCompanyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubCompanyDto: UpdateSubCompanyDto,
  ) {
    return this.subCompanyService.update(+id, updateSubCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.subCompanyService.remove(id);
  }
}

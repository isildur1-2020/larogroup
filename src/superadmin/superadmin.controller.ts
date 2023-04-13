import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
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

  @Get(':companyId')
  findAll(@Param('companyId', ParseMongoIdPipe) companyId: string) {
    return this.superadminService.findAll(companyId);
  }

  // @Get(':id')
  // findOne(@Param('id', ParseMongoIdPipe) id: string) {
  //   return this.superadminService.findById(id);
  // }

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

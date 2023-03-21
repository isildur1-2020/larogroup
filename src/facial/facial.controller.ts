import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { FacialService } from './facial.service';
import { CreateFacialDto } from './dto/create-facial.dto';
import { UpdateFacialDto } from './dto/update-facial.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('facial')
export class FacialController {
  constructor(private readonly facialService: FacialService) {}

  @Post()
  create(@Body() createFacialDto: CreateFacialDto) {
    return this.facialService.create(createFacialDto);
  }

  @Get(':id')
  findAll(@Param('id', ParseMongoIdPipe) id: string) {
    return this.facialService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacialDto: UpdateFacialDto) {
    return this.facialService.update(+id, updateFacialDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.facialService.remove(id);
  }
}

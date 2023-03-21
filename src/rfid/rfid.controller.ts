import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { RfidService } from './rfid.service';
import { CreateRfidDto } from './dto/create-rfid.dto';
import { UpdateRfidDto } from './dto/update-rfid.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('rfid')
export class RfidController {
  constructor(private readonly rfidService: RfidService) {}

  @Post()
  create(@Body() createRfidDto: CreateRfidDto) {
    return this.rfidService.create(createRfidDto);
  }

  @Get(':employeeId')
  findAll(@Param('employeeId', ParseMongoIdPipe) employeeId: string) {
    return this.rfidService.findAll(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rfidService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRfidDto: UpdateRfidDto) {
    return this.rfidService.update(+id, updateRfidDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rfidService.remove(id);
  }
}

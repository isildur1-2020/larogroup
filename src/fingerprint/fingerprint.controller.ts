import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { FingerprintService } from './fingerprint.service';
import { CreateFingerprintDto } from './dto/create-fingerprint.dto';
import { UpdateFingerprintDto } from './dto/update-fingerprint.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('fingerprint')
export class FingerprintController {
  constructor(private readonly fingerprintService: FingerprintService) {}

  @Post()
  create(@Body() createFingerprintDto: CreateFingerprintDto) {
    return this.fingerprintService.create(createFingerprintDto);
  }

  @Get(':employeeId')
  findAll(@Param('employeeId', ParseMongoIdPipe) employeeId: string) {
    return this.fingerprintService.findAll(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fingerprintService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFingerprintDto: UpdateFingerprintDto,
  ) {
    return this.fingerprintService.update(+id, updateFingerprintDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.fingerprintService.remove(id);
  }
}

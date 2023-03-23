import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  UploadedFile,
  UseInterceptors,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from '../common/multer';
import { FingerprintService } from './fingerprint.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFingerprintDto } from './dto/create-fingerprint.dto';
import { UpdateFingerprintDto } from './dto/update-fingerprint.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('fingerprint')
export class FingerprintController {
  constructor(private readonly fingerprintService: FingerprintService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('fingerprint', {
      fileFilter,
      storage: diskStorage({
        destination: './static/fingerprints',
        filename: fileNamer,
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFingerprintDto: CreateFingerprintDto,
  ) {
    return this.fingerprintService.create(createFingerprintDto, file);
  }

  @Get()
  findAll(@Query('employeeId', ParseMongoIdPipe) employeeId: string) {
    return this.fingerprintService.findAll(employeeId);
  }

  @Get(':fingerprintId')
  findOne(@Param('fingerprintId') id: string, @Res() res: Response) {
    return this.fingerprintService.findOne(id, res);
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

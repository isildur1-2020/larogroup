import {
  Res,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { filePath } from 'src/utils/filePath';
import { fileFilter, fileNamer } from '../common/multer';
import { FingerprintService } from './fingerprint.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFingerprintDto } from './dto/create-fingerprint.dto';
import { UpdateFingerprintDto } from './dto/update-fingerprint.dto';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('fingerprint')
export class FingerprintController {
  constructor(private readonly fingerprintService: FingerprintService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.coordinator)
  @UseInterceptors(
    FileInterceptor('fingerprint', {
      fileFilter,
      storage: diskStorage({
        filename: fileNamer,
        destination: `.${filePath.root}${filePath.temporal}`,
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFingerprintDto: CreateFingerprintDto,
  ) {
    return this.fingerprintService.create(createFingerprintDto, file);
  }

  @Get('count')
  getFingerprintCountByEmployee(
    @Query('employee_id', ParseMongoIdPipe) employee_id: string,
  ) {
    return this.fingerprintService.fingerprintCountByEmployee(employee_id);
  }

  @Get()
  findAllBySnDevice(@Query('sn') sn: string) {
    return this.fingerprintService.findAllBySnDevice(sn);
  }

  @Get(':fingerprintId')
  findOne(@Param('fingerprintId') id: string, @Res() res: Response) {
    return this.fingerprintService.findOneByName(id, res);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateFingerprintDto: UpdateFingerprintDto,
  ) {
    return this.fingerprintService.update(id, updateFingerprintDto);
  }
}

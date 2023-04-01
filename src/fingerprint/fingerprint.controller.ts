import {
  Res,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from '../common/multer';
import { FingerprintService } from './fingerprint.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateFingerprintDto } from './dto/create-fingerprint.dto';
import { UpdateFingerprintDto } from './dto/update-fingerprint.dto';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('fingerprint')
export class FingerprintController {
  constructor(private readonly fingerprintService: FingerprintService) {}

  @Post()
  @Auth(ValidRoles.coordinator)
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
  @Auth(ValidRoles.coordinator)
  findAllBySubCompany(
    @GetUser('sub_company', ParseMongoIdPipe) sub_company: string,
  ) {
    return this.fingerprintService.findAllBySubCompany(sub_company);
  }

  @Get(':fingerprintId')
  @Auth(ValidRoles.coordinator)
  findOne(@Param('fingerprintId') id: string, @Res() res: Response) {
    return this.fingerprintService.findOneByName(id, res);
  }

  @Patch(':id')
  @Auth(ValidRoles.coordinator)
  update(
    @Param('id') id: string,
    @Body() updateFingerprintDto: UpdateFingerprintDto,
  ) {
    return this.fingerprintService.update(+id, updateFingerprintDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.coordinator)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.fingerprintService.remove(id);
  }
}

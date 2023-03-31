import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  Query,
} from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { UpdateBarcodeDto } from './dto/update-barcode.dto';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('barcode')
export class BarcodeController {
  constructor(private readonly barcodeService: BarcodeService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  create(@Body() createBarcodeDto: CreateBarcodeDto) {
    return this.barcodeService.create(createBarcodeDto);
  }

  @Get(':employeeId')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findAll(@Param('employeeId', ParseMongoIdPipe) employeeId: string) {
    return this.barcodeService.findAll(employeeId);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  update(@Param('id') id: string, @Body() updateBarcodeDto: UpdateBarcodeDto) {
    return this.barcodeService.update(+id, updateBarcodeDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.barcodeService.remove(id);
  }
}

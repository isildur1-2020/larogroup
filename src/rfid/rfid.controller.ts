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
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('rfid')
export class RfidController {
  constructor(private readonly rfidService: RfidService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  create(@Body() createRfidDto: CreateRfidDto) {
    return this.rfidService.create(createRfidDto);
  }

  @Get(':employee')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findAll(@Param('employee', ParseMongoIdPipe) employee: string) {
    return this.rfidService.findAll(employee);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  update(@Param('id') id: string, @Body() updateRfidDto: UpdateRfidDto) {
    return this.rfidService.update(+id, updateRfidDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rfidService.remove(id);
  }
}

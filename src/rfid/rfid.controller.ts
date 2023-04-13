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

  @Get(':employee_id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findAll(@Param('employee_id', ParseMongoIdPipe) employee_id: string) {
    return this.rfidService.findAll(employee_id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRfidDto: UpdateRfidDto,
  ) {
    return this.rfidService.update(id, updateRfidDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rfidService.remove(id);
  }
}

import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { AccessEmployeeService } from './access_employee.service';
import { CreateAccessEmployeeDto } from './dto/create-access_employee.dto';
import { UpdateAccessEmployeeDto } from './dto/update-access_employee.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('access-employee')
export class AccessEmployeeController {
  constructor(private readonly accessEmployeeService: AccessEmployeeService) {}

  @Post()
  create(@Body() createAccessEmployeeDto: CreateAccessEmployeeDto) {
    return this.accessEmployeeService.create(createAccessEmployeeDto);
  }

  @Get()
  findAll() {
    return this.accessEmployeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessEmployeeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccessEmployeeDto: UpdateAccessEmployeeDto,
  ) {
    return this.accessEmployeeService.update(+id, updateAccessEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.accessEmployeeService.remove(id);
  }
}

import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { DniTypeService } from './dni_type.service';
import { CreateDniTypeDto } from './dto/create-dni_type.dto';
import { UpdateDniTypeDto } from './dto/update-dni_type.dto';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('dni-type')
export class DniTypeController {
  constructor(private readonly dniTypeService: DniTypeService) {}

  @Post()
  @Auth(ValidRoles.superadmin)
  create(@Body() createDniTypeDto: CreateDniTypeDto) {
    return this.dniTypeService.create(createDniTypeDto);
  }

  @Get()
  @Auth(ValidRoles.superadmin)
  findAll() {
    return this.dniTypeService.findAll();
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateDniTypeDto: UpdateDniTypeDto,
  ) {
    return this.dniTypeService.update(id, updateDniTypeDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.dniTypeService.remove(id);
  }
}

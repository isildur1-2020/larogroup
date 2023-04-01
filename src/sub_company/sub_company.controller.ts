import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { SubCompanyService } from './sub_company.service';
import { CreateSubCompanyDto } from './dto/create-sub_company.dto';
import { UpdateSubCompanyDto } from './dto/update-sub_company.dto';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('sub-company')
export class SubCompanyController {
  constructor(private readonly subCompanyService: SubCompanyService) {}

  @Post()
  @Auth(ValidRoles.superadmin)
  create(@Body() createSubCompanyDto: CreateSubCompanyDto) {
    return this.subCompanyService.create(createSubCompanyDto);
  }

  @Get()
  @Auth(ValidRoles.superadmin)
  findAll() {
    return this.subCompanyService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin)
  findOne(@Param('id') id: string) {
    return this.subCompanyService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin)
  update(
    @Param('id') id: string,
    @Body() updateSubCompanyDto: UpdateSubCompanyDto,
  ) {
    return this.subCompanyService.update(+id, updateSubCompanyDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.subCompanyService.remove(id);
  }
}

import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Auth } from '../auth/decorators/auth-decorator.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Auth(ValidRoles.superadmin)
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @Auth(ValidRoles.superadmin)
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.companyService.remove(id);
  }
}

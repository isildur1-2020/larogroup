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
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { filePath } from 'src/utils/filePath';
import { EmployeeService } from './employee.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ParseCategoriesPipe } from './pipes/parse-categories.pipe';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { xlsxTemplateFilter, xlsxTemplateNamer } from 'src/common/multer';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { ParseAccessGroupPipe } from 'src/common/pipes/parse-access-group/parse-access-group.pipe';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  create(
    @Body(ParseCategoriesPipe, ParseAccessGroupPipe)
    createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post('upload')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  @UseInterceptors(
    FileInterceptor('template', {
      fileFilter: xlsxTemplateFilter,
      storage: diskStorage({
        destination: `.${filePath.root}${filePath.temporal}`,
        filename: xlsxTemplateNamer,
      }),
    }),
  )
  uploadData(@UploadedFile() file: Express.Multer.File) {
    return this.employeeService.uploadEmployees(file);
  }

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator, ValidRoles.coordinator)
  findAll(@GetUser() payload: JwtPayload) {
    return this.employeeService.findAll(payload);
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body(ParseCategoriesPipe, ParseAccessGroupPipe)
    updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.employeeService.remove(id);
  }
}

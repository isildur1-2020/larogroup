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
import { fileFilter, fileNamer } from 'src/common/multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ParseCategoriesPipe } from './pipes/parse-categories.pipe';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  create(@Body(ParseCategoriesPipe) createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
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
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Patch(':employee_id/profile-picture')
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter,
      storage: diskStorage({
        destination: `.${filePath.profilePictures}`,
        filename: fileNamer,
      }),
    }),
  )
  uploadSeflie(
    @Param('employee_id', ParseMongoIdPipe) employee_id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.employeeService.uploadProfilePicture(employee_id, file);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.employeeService.remove(id);
  }
}

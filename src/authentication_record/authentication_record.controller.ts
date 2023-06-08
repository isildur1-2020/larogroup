import {
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Controller,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseDatePipe } from 'src/common/pipes/parse-date/parse-date.pipe';
import { AuthenticationRecordService } from './authentication_record.service';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreateAuthenticationRecordDto } from './dto/create-authentication_record.dto';

@Controller('authentication-record')
export class AuthenticationRecordController {
  constructor(
    private readonly authenticationRecordService: AuthenticationRecordService,
  ) {}

  @Post()
  create(@Body() createAuthenticationRecordDto: CreateAuthenticationRecordDto) {
    return this.authenticationRecordService.create(
      createAuthenticationRecordDto,
    );
  }

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator, ValidRoles.coordinator)
  findAll(
    @Query('start_date', ParseDatePipe) start_date: string,
    @Query('end_date', ParseDatePipe) end_date: string,
  ) {
    return this.authenticationRecordService.findAll(start_date, end_date);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authenticationRecordService.remove(id);
  }
}

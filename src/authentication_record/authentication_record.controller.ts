import {
  Get,
  Req,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { CustomRequest } from './interfaces/authRecord.interface';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseDatePipe } from 'src/common/pipes/parse-date/parse-date.pipe';
import { AuthenticationRecordService } from './authentication_record.service';
import { AccessGroupInterceptor } from './interceptors/access-group.interceptor';
import { AntiPassbackInterceptor } from './interceptors/antipassback.interceptor';
import { IsActiveUserInterceptor } from './interceptors/is-active-user.interceptor';
import { ContractActiveInterceptor } from './interceptors/contract-date.interceptor';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreateAuthenticationRecordDto } from './dto/create-authentication_record.dto';
import { DiscoverEntityInterceptor } from './interceptors/discover-entity.interceptor';

@Controller('authentication-record')
export class AuthenticationRecordController {
  constructor(
    private readonly authenticationRecordService: AuthenticationRecordService,
  ) {}

  @Post()
  @UseInterceptors(
    DiscoverEntityInterceptor,
    AccessGroupInterceptor,
    IsActiveUserInterceptor,
    ContractActiveInterceptor,
    AntiPassbackInterceptor,
  )
  create(
    @Req() req: CustomRequest,
    @Body() createAuthenticationRecordDto: CreateAuthenticationRecordDto,
  ) {
    return this.authenticationRecordService.create(
      req,
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

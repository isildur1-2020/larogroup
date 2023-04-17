import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { Get, Post, Body, Param, Delete, Controller } from '@nestjs/common';
import { AuthenticationRecordService } from './authentication_record.service';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreateAuthenticationRecordDto } from './dto/create-authentication_record.dto';

@Controller('authentication-record')
export class AuthenticationRecordController {
  constructor(
    private readonly authenticationRecordService: AuthenticationRecordService,
  ) {}

  @Post()
  @Auth(ValidRoles.coordinator)
  create(@Body() createAuthenticationRecordDto: CreateAuthenticationRecordDto) {
    return this.authenticationRecordService.create(
      createAuthenticationRecordDto,
    );
  }

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findAll() {
    return this.authenticationRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authenticationRecordService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authenticationRecordService.remove(id);
  }
}

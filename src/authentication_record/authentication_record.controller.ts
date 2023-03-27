import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { AuthenticationRecordService } from './authentication_record.service';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreateAuthenticationRecordDto } from './dto/create-authentication_record.dto';
import { UpdateAuthenticationRecordDto } from './dto/update-authentication_record.dto';

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
  findAll() {
    return this.authenticationRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authenticationRecordService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthenticationRecordDto: UpdateAuthenticationRecordDto,
  ) {
    return this.authenticationRecordService.update(
      +id,
      updateAuthenticationRecordDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authenticationRecordService.remove(id);
  }
}

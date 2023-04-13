import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { AuthenticationMethodService } from './authentication_method.service';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreateAuthenticationMethodDto } from './dto/create-authentication_method.dto';
import { UpdateAuthenticationMethodDto } from './dto/update-authentication_method.dto';

@Controller('authentication-method')
export class AuthenticationMethodController {
  constructor(
    private readonly authenticationMethodService: AuthenticationMethodService,
  ) {}

  @Post()
  @Auth(ValidRoles.superadmin)
  create(@Body() createAuthenticationMethodDto: CreateAuthenticationMethodDto) {
    return this.authenticationMethodService.create(
      createAuthenticationMethodDto,
    );
  }

  @Get()
  @Auth(ValidRoles.superadmin)
  findAll() {
    return this.authenticationMethodService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authenticationMethodService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin)
  update(
    @Param('id') id: string,
    @Body() updateAuthenticationMethodDto: UpdateAuthenticationMethodDto,
  ) {
    return this.authenticationMethodService.update(
      id,
      updateAuthenticationMethodDto,
    );
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authenticationMethodService.remove(id);
  }
}

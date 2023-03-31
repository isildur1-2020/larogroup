import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from '../auth/decorators/auth-decorator.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { validRoles } from 'src/auth/interfaces/valid-roles.interface';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('administrator')
export class AdministratorController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Post()
  create(@Body() createAdministratorDto: CreateAdministratorDto) {
    return this.administratorService.create(createAdministratorDto);
  }

  @Get(':companyId')
  @Auth(validRoles.superadmin)
  findAll(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @GetUser() user: JwtPayload,
  ) {
    console.log(user);
    return this.administratorService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.administratorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ) {
    return this.administratorService.update(id, updateAdministratorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.administratorService.remove(id);
  }
}

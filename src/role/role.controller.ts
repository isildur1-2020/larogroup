import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  // @Auth(ValidRoles.superadmin)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  // @Auth(ValidRoles.superadmin)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.roleService.remove(id);
  }
}

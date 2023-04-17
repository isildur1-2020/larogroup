import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { AccessGroupService } from './access_group.service';
import { Auth } from 'src/auth/decorators/auth-decorator.decorator';
import { CreateAccessGroupDto } from './dto/create-access_group.dto';
import { UpdateAccessGroupDto } from './dto/update-access_group.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseDevicesPipe } from './pipes/devices-pipe/devices-pipe.pipe';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('access-group')
export class AccessGroupController {
  constructor(private readonly accessGroupService: AccessGroupService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  create(@Body(ParseDevicesPipe) createAccessGroupDto: CreateAccessGroupDto) {
    return this.accessGroupService.create(createAccessGroupDto);
  }

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findAll() {
    return this.accessGroupService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findOne(@Param('id') id: string) {
    return this.accessGroupService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body(ParseDevicesPipe) updateAccessGroupDto: UpdateAccessGroupDto,
  ) {
    return this.accessGroupService.update(id, updateAccessGroupDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.accessGroupService.remove(id);
  }
}

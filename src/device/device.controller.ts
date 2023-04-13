import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { Auth } from '../auth/decorators/auth-decorator.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

  @Get()
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  findAll() {
    return this.deviceService.findAll();
  }

  @Patch(':id')
  @Auth(ValidRoles.superadmin, ValidRoles.administrator)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return this.deviceService.update(id, updateDeviceDto);
  }

  @Patch(':id/change-status')
  changeStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.deviceService.changeStatus(id, changeStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.deviceService.remove(id);
  }
}

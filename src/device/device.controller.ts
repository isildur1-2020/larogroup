import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  Controller,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { IsOnlineDto } from './dto/is-online.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
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
  @Auth(ValidRoles.superadmin, ValidRoles.administrator, ValidRoles.coordinator)
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

  @Patch()
  updateBySn(@Query('sn') sn: string, @Body() isOnlineDto: IsOnlineDto) {
    return this.deviceService.updatebySN(sn, isOnlineDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.deviceService.remove(id);
  }
}

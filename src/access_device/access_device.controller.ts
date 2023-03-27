import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { AccessDeviceService } from './access_device.service';
import { CreateAccessDeviceDto } from './dto/create-access_device.dto';
import { UpdateAccessDeviceDto } from './dto/update-access_device.dto';

@Controller('access-device')
export class AccessDeviceController {
  constructor(private readonly accessDeviceService: AccessDeviceService) {}

  @Post()
  create(@Body() createAccessDeviceDto: CreateAccessDeviceDto) {
    return this.accessDeviceService.create(createAccessDeviceDto);
  }

  @Get()
  findAll() {
    return this.accessDeviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessDeviceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccessDeviceDto: UpdateAccessDeviceDto,
  ) {
    return this.accessDeviceService.update(+id, updateAccessDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessDeviceService.remove(id);
  }
}

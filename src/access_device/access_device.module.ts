import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceModule } from '../device/device.module';
import { AccessDeviceService } from './access_device.service';
import { AccessDeviceController } from './access_device.controller';
import { AccessGroupModule } from 'src/access_group/access_group.module';
import {
  AccessDevice,
  AccessDeviceSchema,
} from './entities/access_device.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AccessDevice.name,
        schema: AccessDeviceSchema,
      },
    ]),
    DeviceModule,
    AccessGroupModule,
  ],
  controllers: [AccessDeviceController],
  providers: [AccessDeviceService],
})
export class AccessDeviceModule {}

import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceController } from './device.controller';
import { CampusModule } from 'src/campus/campus.module';
import { Device, DeviceSchema } from './entities/device.entity';
import { DirectionModule } from 'src/direction/direction.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Device.name,
        schema: DeviceSchema,
      },
    ]),
    CampusModule,
    DirectionModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}

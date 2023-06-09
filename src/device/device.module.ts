import { DeviceService } from './device.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ZoneModule } from 'src/zone/zone.module';
import { Module, forwardRef } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { CampusModule } from 'src/campus/campus.module';
import { Device, DeviceSchema } from './entities/device.entity';
import { DirectionModule } from 'src/direction/direction.module';
import { AccessGroupModule } from 'src/access_group/access_group.module';
import { AuthenticationRecordModule } from 'src/authentication_record/authentication_record.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Device.name,
        schema: DeviceSchema,
      },
    ]),
    forwardRef(() => ZoneModule),
    forwardRef(() => CampusModule),
    forwardRef(() => DirectionModule),
    forwardRef(() => AccessGroupModule),
    forwardRef(() => AuthenticationRecordModule),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}

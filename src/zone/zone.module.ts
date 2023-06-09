import { ZoneService } from './zone.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ZoneController } from './zone.controller';
import { Module, forwardRef } from '@nestjs/common';
import { DeviceModule } from 'src/device/device.module';
import { Zone, ZoneSchema } from './entities/zone.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Zone.name,
        schema: ZoneSchema,
      },
    ]),
    forwardRef(() => DeviceModule),
  ],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [ZoneService],
})
export class ZoneModule {}

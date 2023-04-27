import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { DirectionService } from './direction.service';
import { DeviceModule } from 'src/device/device.module';
import { DirectionController } from './direction.controller';
import { Direction, DirectionSchema } from './entities/direction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Direction.name,
        schema: DirectionSchema,
      },
    ]),
    forwardRef(() => DeviceModule),
  ],
  controllers: [DirectionController],
  providers: [DirectionService],
  exports: [DirectionService],
})
export class DirectionModule {}

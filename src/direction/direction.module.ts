import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectionService } from './direction.service';
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
  ],
  controllers: [DirectionController],
  providers: [DirectionService],
  exports: [DirectionService],
})
export class DirectionModule {}

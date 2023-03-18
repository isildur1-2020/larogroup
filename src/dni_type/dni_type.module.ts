import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DniTypeService } from './dni_type.service';
import { DniTypeController } from './dni_type.controller';
import { DniType, DniTypeSchema } from './entities/dni_type.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DniType.name,
        schema: DniTypeSchema,
      },
    ]),
  ],
  controllers: [DniTypeController],
  providers: [DniTypeService],
})
export class DniTypeModule {}

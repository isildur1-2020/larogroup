import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpulsionService } from './expulsion.service';
import { ExpulsionController } from './expulsion.controller';
import { Expulsion, ExpulsionSchema } from './entities/expulsion.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Expulsion.name,
        schema: ExpulsionSchema,
      },
    ]),
  ],
  controllers: [ExpulsionController],
  providers: [ExpulsionService],
  exports: [ExpulsionService],
})
export class ExpulsionModule {}

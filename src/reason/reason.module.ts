import { Module } from '@nestjs/common';
import { ReasonService } from './reason.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReasonController } from './reason.controller';
import { Reason, ReasonSchema } from './entities/reason.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reason.name,
        schema: ReasonSchema,
      },
    ]),
  ],
  controllers: [ReasonController],
  providers: [ReasonService],
  exports: [ReasonService],
})
export class ReasonModule {}

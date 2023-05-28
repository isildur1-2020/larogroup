import { Module } from '@nestjs/common';
import { ExpulsionService } from './expulsion.service';
import { ExpulsionController } from './expulsion.controller';

@Module({
  controllers: [ExpulsionController],
  providers: [ExpulsionService]
})
export class ExpulsionModule {}

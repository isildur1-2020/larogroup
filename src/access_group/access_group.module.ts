import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessGroupService } from './access_group.service';
import { AccessGroupController } from './access_group.controller';
import { AccessGroup, AccessGroupSchema } from './entities/access_group.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AccessGroup.name,
        schema: AccessGroupSchema,
      },
    ]),
  ],
  controllers: [AccessGroupController],
  providers: [AccessGroupService],
  exports: [AccessGroupService],
})
export class AccessGroupModule {}

import { Module } from '@nestjs/common';
import { CampusService } from './campus.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CampusController } from './campus.controller';
import { Campus, CampusSchema } from './entities/campus.entity';
import { SubCompanyModule } from 'src/sub_company/sub_company.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Campus.name,
        schema: CampusSchema,
      },
    ]),
    SubCompanyModule,
  ],
  controllers: [CampusController],
  providers: [CampusService],
  exports: [CampusService],
})
export class CampusModule {}

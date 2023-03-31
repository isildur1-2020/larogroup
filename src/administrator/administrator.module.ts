import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from 'src/company/company.module';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import {
  Administrator,
  AdministratorSchema,
} from './entities/administrator.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Administrator.name,
        schema: AdministratorSchema,
      },
    ]),
    CompanyModule,
  ],
  controllers: [AdministratorController],
  providers: [AdministratorService],
  exports: [AdministratorService],
})
export class AdministratorModule {}

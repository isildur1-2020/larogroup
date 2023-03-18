import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCompanyService } from './sub_company.service';
import { SubCompanyController } from './sub_company.controller';
import { SubCompany, SubCompanySchema } from './entities/sub_company.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SubCompany.name,
        schema: SubCompanySchema,
      },
    ]),
  ],
  controllers: [SubCompanyController],
  providers: [SubCompanyService],
})
export class SubCompanyModule {}

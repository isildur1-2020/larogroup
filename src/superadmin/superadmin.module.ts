import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperadminService } from './superadmin.service';
import { CompanyModule } from 'src/company/company.module';
import { SuperadminController } from './superadmin.controller';
import { Superadmin, SuperadminSchema } from './entities/superadmin.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Superadmin.name,
        schema: SuperadminSchema,
      },
    ]),
    CompanyModule,
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
})
export class SuperadminModule {}

import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { CompanyModule } from 'src/company/company.module';
import { SuperadminController } from './superadmin.controller';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
import { Superadmin, SuperadminSchema } from './entities/superadmin.entity';
import { AdministratorModule } from 'src/administrator/administrator.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Superadmin.name,
        schema: SuperadminSchema,
      },
    ]),
    CompanyModule,
    forwardRef(() => CoordinatorModule),
    forwardRef(() => AdministratorModule),
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
  exports: [SuperadminService],
})
export class SuperadminModule {}

import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { Module, forwardRef } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { AdministratorService } from './administrator.service';
import { SuperadminModule } from 'src/superadmin/superadmin.module';
import { AdministratorController } from './administrator.controller';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
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
    forwardRef(() => RoleModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => SuperadminModule),
    forwardRef(() => CoordinatorModule),
  ],
  controllers: [AdministratorController],
  providers: [AdministratorService],
  exports: [AdministratorService],
})
export class AdministratorModule {}

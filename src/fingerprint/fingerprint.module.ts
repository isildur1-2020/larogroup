import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceModule } from 'src/device/device.module';
import { FingerprintService } from './fingerprint.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { FingerprintController } from './fingerprint.controller';
import { AccessGroupModule } from 'src/access_group/access_group.module';
import { Fingerprint, FingerprintSchema } from './entities/fingerprint.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Fingerprint.name,
        schema: FingerprintSchema,
      },
    ]),
    DeviceModule,
    EmployeeModule,
    AccessGroupModule,
  ],
  controllers: [FingerprintController],
  providers: [FingerprintService],
})
export class FingerprintModule {}

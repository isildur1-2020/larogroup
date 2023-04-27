import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
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
    forwardRef(() => DeviceModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => AccessGroupModule),
  ],
  controllers: [FingerprintController],
  providers: [FingerprintService],
  exports: [FingerprintService],
})
export class FingerprintModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FingerprintService } from './fingerprint.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { FingerprintController } from './fingerprint.controller';
import { Fingerprint, FingerprintSchema } from './entities/fingerprint.entity';
import { DeviceModule } from 'src/device/device.module';

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
  ],
  controllers: [FingerprintController],
  providers: [FingerprintService],
})
export class FingerprintModule {}

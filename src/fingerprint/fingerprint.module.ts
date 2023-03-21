import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FingerprintService } from './fingerprint.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { FingerprintController } from './fingerprint.controller';
import { Fingerprint, FingerprintSchema } from './entities/fingerprint.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Fingerprint.name,
        schema: FingerprintSchema,
      },
    ]),
    EmployeeModule,
  ],
  controllers: [FingerprintController],
  providers: [FingerprintService],
})
export class FingerprintModule {}

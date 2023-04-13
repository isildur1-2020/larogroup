import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarcodeService } from './barcode.service';
import { BarcodeController } from './barcode.controller';
import { EmployeeModule } from 'src/employee/employee.module';
import { Barcode, BarcodeSchema } from './entities/barcode.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Barcode.name,
        schema: BarcodeSchema,
      },
    ]),
    EmployeeModule,
  ],
  controllers: [BarcodeController],
  providers: [BarcodeService],
  exports: [BarcodeService],
})
export class BarcodeModule {}

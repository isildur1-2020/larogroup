import { Module } from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { MongooseModule } from '@nestjs/mongoose';
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
})
export class BarcodeModule {}
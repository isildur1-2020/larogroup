import { MongooseModule } from '@nestjs/mongoose';
import { BarcodeService } from './barcode.service';
import { Module, forwardRef } from '@nestjs/common';
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
    forwardRef(() => EmployeeModule),
  ],
  controllers: [BarcodeController],
  providers: [BarcodeService],
  exports: [BarcodeService],
})
export class BarcodeModule {}

import { RfidService } from './rfid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RfidController } from './rfid.controller';
import { Module, forwardRef } from '@nestjs/common';
import { Rfid, RfidSchema } from './entities/rfid.entity';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Rfid.name,
        schema: RfidSchema,
      },
    ]),
    forwardRef(() => EmployeeModule),
  ],
  controllers: [RfidController],
  providers: [RfidService],
  exports: [RfidService],
})
export class RfidModule {}

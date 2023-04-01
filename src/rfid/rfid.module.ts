import { Module } from '@nestjs/common';
import { RfidService } from './rfid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RfidController } from './rfid.controller';
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
    EmployeeModule,
  ],
  controllers: [RfidController],
  providers: [RfidService],
  exports: [RfidService],
})
export class RfidModule {}

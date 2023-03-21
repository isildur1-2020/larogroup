import { Module } from '@nestjs/common';
import { FacialService } from './facial.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FacialController } from './facial.controller';
import { EmployeeModule } from 'src/employee/employee.module';
import { Facial, FacialSchema } from './entities/facial.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Facial.name,
        schema: FacialSchema,
      },
    ]),
    EmployeeModule,
  ],
  controllers: [FacialController],
  providers: [FacialService],
})
export class FacialModule {}

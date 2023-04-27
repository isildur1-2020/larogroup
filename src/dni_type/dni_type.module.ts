import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { DniTypeService } from './dni_type.service';
import { DniTypeController } from './dni_type.controller';
import { EmployeeModule } from 'src/employee/employee.module';
import { DniType, DniTypeSchema } from './entities/dni_type.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DniType.name,
        schema: DniTypeSchema,
      },
    ]),
    forwardRef(() => EmployeeModule),
  ],
  controllers: [DniTypeController],
  providers: [DniTypeService],
  exports: [DniTypeService],
})
export class DniTypeModule {}

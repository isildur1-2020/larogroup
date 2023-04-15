import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { Vehicle, VehicleSchema } from './entities/vehicle.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vehicle.name,
        schema: VehicleSchema,
      },
    ]),
    RoleModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}

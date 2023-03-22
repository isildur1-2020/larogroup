import { MongooseModule } from '@nestjs/mongoose';
import { CoordinatorService } from './coordinator.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { CoordinatorController } from './coordinator.controller';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { Coordinator, CoordinatorSchema } from './entities/coordinator.entity';
import { HashPasswordMiddleware } from '../common/middlewares/hash-password.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coordinator.name,
        schema: CoordinatorSchema,
      },
    ]),
    EmployeeModule,
  ],
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
})
export class CoordinatorModule {
  configure(consume: MiddlewareConsumer) {
    consume.apply(HashPasswordMiddleware).forRoutes({
      path: 'coordinator',
      method: RequestMethod.POST,
    });
  }
}

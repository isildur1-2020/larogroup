import { MongooseModule } from '@nestjs/mongoose';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HashPasswordMiddleware } from '../common/middlewares/hash-password.middleware';
import {
  Administrator,
  AdministratorSchema,
} from './entities/administrator.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Administrator.name,
        schema: AdministratorSchema,
      },
    ]),
  ],
  controllers: [AdministratorController],
  providers: [AdministratorService],
})
export class AdministratorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes({
      path: 'administrator',
      method: RequestMethod.POST,
    });
  }
}

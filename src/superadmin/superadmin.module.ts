import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';
import { SuperadminService } from './superadmin.service';
import { CompanyModule } from 'src/company/company.module';
import { SuperadminController } from './superadmin.controller';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { Superadmin, SuperadminSchema } from './entities/superadmin.entity';
import { HashPasswordMiddleware } from 'src/common/middlewares/hash-password.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Superadmin.name,
        schema: SuperadminSchema,
      },
    ]),
    RoleModule,
    CompanyModule,
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
})
export class SuperadminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes({
      path: 'superadmin',
      method: RequestMethod.POST,
    });
  }
}

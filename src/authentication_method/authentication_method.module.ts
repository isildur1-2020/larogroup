import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { AuthenticationMethodService } from './authentication_method.service';
import { AuthenticationMethodController } from './authentication_method.controller';
import { AuthenticationRecordModule } from 'src/authentication_record/authentication_record.module';
import {
  AuthenticationMethod,
  AuthenticationMethodSchema,
} from './entities/authentication_method.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthenticationMethod.name,
        schema: AuthenticationMethodSchema,
      },
    ]),
    forwardRef(() => AuthenticationRecordModule),
  ],
  controllers: [AuthenticationMethodController],
  providers: [AuthenticationMethodService],
  exports: [AuthenticationMethodService],
})
export class AuthenticationMethodModule {}

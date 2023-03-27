import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationMethodService } from './authentication_method.service';
import { AuthenticationMethodController } from './authentication_method.controller';
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
  ],
  controllers: [AuthenticationMethodController],
  providers: [AuthenticationMethodService],
  exports: [AuthenticationMethodService],
})
export class AuthenticationMethodModule {}

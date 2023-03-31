import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.stategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperadminModule } from '../superadmin/superadmin.module';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
import { AdministratorModule } from '../administrator/administrator.module';

@Module({
  imports: [
    ConfigModule,
    SuperadminModule,
    CoordinatorModule,
    AdministratorModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyTokenDto } from './dto/verifyTokenDto.dto';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import { CoordinatorService } from '../coordinator/coordinator.service';
import { AdministratorService } from '../administrator/administrator.service';
import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService)
    private jwtService: JwtService,
    @Inject(SuperadminService)
    private superadminService: SuperadminService,
    @Inject(AdministratorService)
    private administratorService: AdministratorService,
    @Inject(CoordinatorService)
    private coordinatorService: CoordinatorService,
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {}

  comparePassword(password: string, hash: string): void {
    const isValidPassword = bcrypt.compareSync(password, hash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials, please try again');
    }
  }

  async login(authDto: AuthDto) {
    try {
      let payload: any = {};
      const { username, password } = authDto;
      // VALIDATING IF THE USER IS AN ADMINISTRATOR
      const adminFound = await this.administratorService.findByUsername(
        username,
      );
      if (adminFound !== null) {
        this.comparePassword(password, adminFound.password);
        payload = {
          _id: adminFound._id,
          role: adminFound.role,
          company: adminFound.company,
          username: adminFound.username,
        };
        return {
          ...payload,
          token: this.jwtService.sign(payload),
        };
      }
      // VALIDATING IF THE USER IS A COORDINATOR
      const coordinatorFound = await this.coordinatorService.findByUsername(
        username,
      );
      if (coordinatorFound !== null) {
        this.comparePassword(password, coordinatorFound.password);
        payload = {
          _id: coordinatorFound._id,
          role: coordinatorFound.role,
          username: coordinatorFound.username,
        };
        return {
          ...payload,
          token: this.jwtService.sign(payload),
        };
      }
      // VALIDATING IF THE USER IS A SUPERADMIN
      const superadminFound = await this.superadminService.findByUsername(
        username,
      );
      if (superadminFound !== null) {
        this.comparePassword(password, superadminFound.password);
        payload = {
          _id: superadminFound._id,
          role: superadminFound.role,
          // company: superadminFound.company,
          username: superadminFound.username,
        };
        return {
          ...payload,
          token: this.jwtService.sign(payload),
        };
      }
      throw new UnauthorizedException('Invalid credentials, please try again');
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  verifyToken(verifyTokenDto: VerifyTokenDto) {
    try {
      jwt.verify(verifyTokenDto.token, this.configService.get('JWT_SECRET'));
      return {
        err: false,
        message: 'Token valid',
        token: verifyTokenDto.token,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

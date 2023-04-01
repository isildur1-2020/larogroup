import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
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
  ) {}

  async superadminAuth(authDto: AuthDto) {
    try {
      const { username, password } = authDto;
      const userFound = await this.superadminService.findByUsername(username);
      if (userFound === null) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isValidPassword = bcrypt.compareSync(password, userFound.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = {
        _id: userFound._id,
        role: userFound.role,
        company: userFound.company,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async coordinatorAuth(authDto: AuthDto) {
    try {
      const { username, password } = authDto;
      const userFound = await this.coordinatorService.findByUsername(username);
      if (userFound === null) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isValidPassword = bcrypt.compareSync(password, userFound.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = {
        _id: userFound._id,
        role: userFound.role,
        sub_company: userFound.sub_company,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async administratorAuth(authDto: AuthDto) {
    try {
      const { username, password } = authDto;
      const userFound = await this.administratorService.findByUsername(
        username,
      );
      if (userFound === null) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isValidPassword = bcrypt.compareSync(password, userFound.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = {
        _id: userFound._id,
        role: userFound.role,
        company: userFound.company,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}

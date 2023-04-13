import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { RoleService } from 'src/role/role.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import { Superadmin } from 'src/superadmin/entities/superadmin.entity';
import { CoordinatorService } from 'src/coordinator/coordinator.service';
import { Coordinator } from 'src/coordinator/entities/coordinator.entity';
import { AdministratorService } from 'src/administrator/administrator.service';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(SuperadminService)
    private readonly superadminService: SuperadminService,
    @Inject(CoordinatorService)
    private readonly coordinatorService: CoordinatorService,
    @Inject(AdministratorService)
    private administratorService: AdministratorService,
    @Inject(RoleService)
    private roleService: RoleService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const { _id, role } = payload;
      let userFound: Superadmin | Coordinator | Administrator = null;

      const adminRole = await this.roleService.findOneByName(
        ValidRoles.administrator,
      );
      const coordinatorRole = await this.roleService.findOneByName(
        ValidRoles.coordinator,
      );
      const superadminRole = await this.roleService.findOneByName(
        ValidRoles.superadmin,
      );

      switch (role._id) {
        case adminRole._id.toString():
          userFound = await this.administratorService.findById(_id);
          break;
        case coordinatorRole._id.toString():
          userFound = await this.coordinatorService.findById(_id);
          break;
        case superadminRole._id.toString():
          userFound = await this.superadminService.findById(_id);
          break;
      }

      if (userFound === null) {
        throw new BadRequestException('This user does not exists');
      }
      if (!userFound.is_active) {
        throw new BadRequestException(
          'You are inactive in the system, please contact an admin',
        );
      }

      return payload;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(err.message);
    }
  }
}

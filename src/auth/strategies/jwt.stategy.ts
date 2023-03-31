import { ConfigService } from '@nestjs/config';
import { roles_ids } from '../../utils/role_ids';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(SuperadminService)
    private readonly superadminService: SuperadminService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { role, username } = payload;

    if (role._id === roles_ids.superadmin) {
      const userFound = await this.superadminService.findByUsername(username);
      if (!userFound || !userFound?.is_active) {
        throw new BadRequestException(
          'This user does not exists or you are inactive',
        );
      }
    }
    return {
      payload,
    };
  }
}

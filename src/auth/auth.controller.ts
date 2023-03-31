import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Post, Body, Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/superadmin')
  superadminAuth(@Body() authDto: AuthDto) {
    return this.authService.superadminAuth(authDto);
  }

  @Post('/coordinator')
  coordinator(@Body() authDto: AuthDto) {
    return this.authService.coordinatorAuth(authDto);
  }
}
